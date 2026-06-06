const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const cron = require('node-cron');

const app = express();
const PORT = 8079;
const DATA_FILE = path.join(__dirname, 'data', 'devices.json');
const SCHEDULE_FILE = path.join(__dirname, 'data', 'schedules.json');
const GROUP_FILE = path.join(__dirname, 'data', 'groups.json');
const ROOM_FILE = path.join(__dirname, 'data', 'rooms.json');
const SCENE_FILE = path.join(__dirname, 'data', 'scenes.json');
const AUTOMATION_FILE = path.join(__dirname, 'data', 'automations.json');
const SYSTEM_STATE_FILE = path.join(__dirname, 'data', 'systemState.json');

const activeJobs = new Map();
const automationJobs = new Map();

app.use(cors());
app.use(express.json());

const ensureDataFile = async () => {
  const exists = await fs.pathExists(DATA_FILE);
  if (!exists) {
    await fs.outputJson(DATA_FILE, { devices: [] });
  }
};

const ensureScheduleFile = async () => {
  const exists = await fs.pathExists(SCHEDULE_FILE);
  if (!exists) {
    await fs.outputJson(SCHEDULE_FILE, { schedules: [] });
  }
};

const ensureGroupFile = async () => {
  const exists = await fs.pathExists(GROUP_FILE);
  if (!exists) {
    await fs.outputJson(GROUP_FILE, { groups: [] });
  }
};

const ensureRoomFile = async () => {
  const exists = await fs.pathExists(ROOM_FILE);
  if (!exists) {
    await fs.outputJson(ROOM_FILE, { rooms: [] });
  }
};

const ensureSceneFile = async () => {
  const exists = await fs.pathExists(SCENE_FILE);
  if (!exists) {
    const presetScenes = [
      {
        id: 'scene-leaving',
        name: '离家模式',
        icon: '🚪',
        color: '#f59e0b',
        description: '关闭所有灯光和电器，开启摄像头录像',
        isPreset: true,
        deviceStates: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'scene-sleep',
        name: '睡眠模式',
        icon: '💤',
        color: '#6366f1',
        description: '关闭主灯，调暗空调，开启静音模式',
        isPreset: true,
        deviceStates: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'scene-movie',
        name: '影院模式',
        icon: '🎬',
        color: '#ec4899',
        description: '调暗灯光，开启电视和音响',
        isPreset: true,
        deviceStates: [],
        createdAt: new Date().toISOString()
      }
    ];
    await fs.outputJson(SCENE_FILE, { scenes: presetScenes });
  }
};

const ensureAutomationFile = async () => {
  const exists = await fs.pathExists(AUTOMATION_FILE);
  if (!exists) {
    const presetAutomations = [
      {
        id: 'auto-evening-light',
        name: '傍晚自动开灯',
        description: '每天18:00自动开启客厅主灯',
        enabled: true,
        isPreset: true,
        trigger: {
          type: 'time',
          condition: 'time_equals',
          value: '18:00'
        },
        actions: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'auto-hot-ac',
        name: '高温自动开空调',
        description: '当客厅温度高于28°C时自动开启空调',
        enabled: true,
        isPreset: true,
        trigger: {
          type: 'device_state',
          deviceId: 'ac-1',
          condition: 'temperature_above',
          value: 28
        },
        actions: [],
        createdAt: new Date().toISOString()
      }
    ];
    await fs.outputJson(AUTOMATION_FILE, { automations: presetAutomations });
  }
};

const ensureSystemStateFile = async () => {
  const exists = await fs.pathExists(SYSTEM_STATE_FILE);
  if (!exists) {
    await fs.outputJson(SYSTEM_STATE_FILE, {
      activeSceneId: null,
      activeSceneActivatedAt: null,
      lastDeviceStates: {}
    });
  }
};

const timeToCron = (time, days = [0, 1, 2, 3, 4, 5, 6]) => {
  const [hour, minute] = time.split(':').map(Number);
  const dayStr = days.length === 7 ? '*' : days.join(',');
  return `${minute} ${hour} * * ${dayStr}`;
};

const executeSchedule = async (schedule) => {
  try {
    const data = await fs.readJson(DATA_FILE);
    const deviceIndex = data.devices.findIndex(d => d.id === schedule.deviceId);
    
    if (deviceIndex === -1) {
      console.log(`Device ${schedule.deviceId} not found for schedule ${schedule.id}`);
      return;
    }

    data.devices[deviceIndex].state = {
      ...data.devices[deviceIndex].state,
      ...schedule.targetState
    };
    
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    console.log(`[${new Date().toLocaleString()}] Executed schedule ${schedule.id}: ${schedule.name} - ${data.devices[deviceIndex].name} set to`, schedule.targetState);
  } catch (err) {
    console.error('Error executing schedule:', err);
  }
};

const loadSchedules = async () => {
  try {
    activeJobs.forEach(job => job.stop());
    activeJobs.clear();

    const data = await fs.readJson(SCHEDULE_FILE);
    
    data.schedules.forEach(schedule => {
      if (schedule.enabled) {
        const cronExpr = timeToCron(schedule.time, schedule.days);
        try {
          const job = cron.schedule(cronExpr, () => executeSchedule(schedule));
          activeJobs.set(schedule.id, job);
          console.log(`Loaded schedule: ${schedule.name} (${cronExpr})`);
        } catch (err) {
          console.error('Failed to schedule job:', schedule.id, err);
        }
      }
    });
  } catch (err) {
    console.error('Error loading schedules:', err);
  }
};

const executeAutomation = async (automation) => {
  try {
    const systemState = await fs.readJson(SYSTEM_STATE_FILE);
    
    if (systemState.activeSceneId) {
      console.log(`[${new Date().toLocaleString()}] Automation ${automation.id} skipped: active scene present`);
      return { skipped: true, reason: 'active_scene' };
    }

    const deviceData = await fs.readJson(DATA_FILE);
    const updatedDevices = [];
    
    for (const action of automation.actions) {
      const deviceIndex = deviceData.devices.findIndex(d => d.id === action.deviceId);
      if (deviceIndex !== -1) {
        deviceData.devices[deviceIndex].state = {
          ...deviceData.devices[deviceIndex].state,
          ...action.state
        };
        updatedDevices.push(deviceData.devices[deviceIndex]);
      }
    }
    
    if (updatedDevices.length > 0) {
      await fs.writeJson(DATA_FILE, deviceData, { spaces: 2 });
      console.log(`[${new Date().toLocaleString()}] Executed automation ${automation.id}: ${automation.name}`);
      return { success: true, updatedDevices };
    }
    
    return { success: false, reason: 'no_devices' };
  } catch (err) {
    console.error('Error executing automation:', err);
    return { success: false, error: err.message };
  }
};

const checkAutomationCondition = async (automation) => {
  try {
    const deviceData = await fs.readJson(DATA_FILE);
    const trigger = automation.trigger;

    if (trigger.type === 'time') {
      const now = new Date();
      const [hour, minute] = trigger.value.split(':').map(Number);
      return now.getHours() === hour && now.getMinutes() === minute;
    }

    if (trigger.type === 'device_state') {
      const device = deviceData.devices.find(d => d.id === trigger.deviceId);
      if (!device) return false;

      switch (trigger.condition) {
        case 'temperature_above':
          return device.state.temperature > trigger.value;
        case 'temperature_below':
          return device.state.temperature < trigger.value;
        case 'sensor_temp_above':
          return device.state.temperature > trigger.value;
        case 'sensor_temp_below':
          return device.state.temperature < trigger.value;
        case 'humidity_above':
          return device.state.humidity > trigger.value;
        case 'humidity_below':
          return device.state.humidity < trigger.value;
        case 'motion_detected':
          return device.state.motionDetected === true;
        case 'motion_cleared':
          return device.state.motionDetected === false;
        case 'smoke_detected':
          return device.state.smokeDetected === true;
        case 'smoke_cleared':
          return device.state.smokeDetected === false;
        case 'on':
          return device.state.on === true;
        case 'off':
          return device.state.on === false;
        default:
          return false;
      }
    }

    return false;
  } catch (err) {
    console.error('Error checking automation condition:', err);
    return false;
  }
};

const loadAutomations = async () => {
  try {
    automationJobs.forEach(job => job.stop());
    automationJobs.clear();

    const data = await fs.readJson(AUTOMATION_FILE);
    
    data.automations.forEach(automation => {
      if (automation.enabled) {
        let cronExpr;
        if (automation.trigger.type === 'time') {
          cronExpr = timeToCron(automation.trigger.value);
        } else {
          cronExpr = '*/30 * * * * *';
        }
        
        try {
          const job = cron.schedule(cronExpr, async () => {
            const conditionMet = await checkAutomationCondition(automation);
            if (conditionMet) {
              await executeAutomation(automation);
            }
          });
          automationJobs.set(automation.id, job);
          console.log(`Loaded automation: ${automation.name} (${cronExpr})`);
        } catch (err) {
          console.error('Failed to schedule automation:', automation.id, err);
        }
      }
    });
  } catch (err) {
    console.error('Error loading automations:', err);
  }
};

const checkConflict = async (type, id) => {
  const systemState = await fs.readJson(SYSTEM_STATE_FILE);
  const sceneData = await fs.readJson(SCENE_FILE);
  const automationData = await fs.readJson(AUTOMATION_FILE);
  const deviceData = await fs.readJson(DATA_FILE);

  const conflicts = [];

  if (type === 'scene') {
    const scene = sceneData.scenes.find(s => s.id === id);
    if (!scene) return { hasConflict: false, conflicts: [] };

    const sceneDeviceIds = scene.deviceStates.map(ds => ds.deviceId);
    
    for (const automation of automationData.automations) {
      if (!automation.enabled) continue;
      
      const automationDeviceIds = automation.actions.map(a => a.deviceId);
      const overlappingDeviceIds = sceneDeviceIds.filter(did => automationDeviceIds.includes(did));
      
      if (overlappingDeviceIds.length > 0) {
        const devices = overlappingDeviceIds.map(did => {
          const device = deviceData.devices.find(d => d.id === did);
          return device ? device.name : did;
        });
        
        conflicts.push({
          type: 'scene_vs_automation',
          sceneId: scene.id,
          sceneName: scene.name,
          automationId: automation.id,
          automationName: automation.name,
          overlappingDevices: devices
        });
      }
    }
  }

  if (type === 'automation') {
    const automation = automationData.automations.find(a => a.id === id);
    if (!automation) return { hasConflict: false, conflicts: [] };

    if (systemState.activeSceneId) {
      const activeScene = sceneData.scenes.find(s => s.id === systemState.activeSceneId);
      const automationDeviceIds = automation.actions.map(a => a.deviceId);
      const sceneDeviceIds = activeScene ? activeScene.deviceStates.map(ds => ds.deviceId) : [];
      const overlappingDeviceIds = automationDeviceIds.filter(did => sceneDeviceIds.includes(did));
      
      if (overlappingDeviceIds.length > 0) {
        const devices = overlappingDeviceIds.map(did => {
          const device = deviceData.devices.find(d => d.id === did);
          return device ? device.name : did;
        });
        
        conflicts.push({
          type: 'automation_vs_active_scene',
          automationId: automation.id,
          automationName: automation.name,
          activeSceneId: systemState.activeSceneId,
          activeSceneName: activeScene?.name,
          overlappingDevices: devices
        });
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
    activeSceneId: systemState.activeSceneId
  };
};

app.get('/api/devices', async (req, res) => {
  try {
    const data = await fs.readJson(DATA_FILE);
    res.json(data);
  } catch (err) {
    console.error('Error reading devices:', err);
    res.status(500).json({ error: 'Failed to read devices' });
  }
});

app.post('/api/devices', async (req, res) => {
  try {
    const { devices } = req.body;
    if (!Array.isArray(devices)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    await fs.writeJson(DATA_FILE, { devices }, { spaces: 2 });
    res.json({ success: true, message: 'Devices saved successfully' });
  } catch (err) {
    console.error('Error saving devices:', err);
    res.status(500).json({ error: 'Failed to save devices' });
  }
});

app.put('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const data = await fs.readJson(DATA_FILE);
    const deviceIndex = data.devices.findIndex(d => d.id === id);
    
    if (deviceIndex === -1) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    data.devices[deviceIndex] = { ...data.devices[deviceIndex], ...updateData };
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    res.json({ success: true, device: data.devices[deviceIndex] });
  } catch (err) {
    console.error('Error updating device:', err);
    res.status(500).json({ error: 'Failed to update device' });
  }
});

app.put('/api/devices/:id/state', async (req, res) => {
  try {
    const { id } = req.params;
    const stateUpdate = req.body;
    const data = await fs.readJson(DATA_FILE);
    const deviceIndex = data.devices.findIndex(d => d.id === id);
    
    if (deviceIndex === -1) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    data.devices[deviceIndex].state = { 
      ...data.devices[deviceIndex].state, 
      ...stateUpdate 
    };
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    res.json({ success: true, state: data.devices[deviceIndex].state });
  } catch (err) {
    console.error('Error updating device state:', err);
    res.status(500).json({ error: 'Failed to update device state' });
  }
});

app.post('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const newDevice = req.body;
    const data = await fs.readJson(DATA_FILE);
    
    const exists = data.devices.find(d => d.id === id);
    if (exists) {
      return res.status(400).json({ error: 'Device already exists' });
    }
    
    data.devices.push({ id, ...newDevice });
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    res.json({ success: true, device: { id, ...newDevice } });
  } catch (err) {
    console.error('Error creating device:', err);
    res.status(500).json({ error: 'Failed to create device' });
  }
});

app.delete('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readJson(DATA_FILE);
    const initialLength = data.devices.length;
    data.devices = data.devices.filter(d => d.id !== id);
    
    if (data.devices.length === initialLength) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    res.json({ success: true, message: 'Device deleted' });
  } catch (err) {
    console.error('Error deleting device:', err);
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

app.get('/api/schedules', async (req, res) => {
  try {
    const data = await fs.readJson(SCHEDULE_FILE);
    res.json(data);
  } catch (err) {
    console.error('Error reading schedules:', err);
    res.status(500).json({ error: 'Failed to read schedules' });
  }
});

app.post('/api/schedules', async (req, res) => {
  try {
    const { schedule } = req.body;
    if (!schedule || !schedule.deviceId || !schedule.time || !schedule.targetState) {
      return res.status(400).json({ error: 'Invalid schedule data' });
    }

    const data = await fs.readJson(SCHEDULE_FILE);
    const newSchedule = {
      id: `schedule-${Date.now()}`,
      name: schedule.name || '定时任务',
      deviceId: schedule.deviceId,
      time: schedule.time,
      days: schedule.days || [0, 1, 2, 3, 4, 5, 6],
      targetState: schedule.targetState,
      enabled: schedule.enabled !== undefined ? schedule.enabled : true,
      createdAt: new Date().toISOString()
    };

    data.schedules.push(newSchedule);
    await fs.writeJson(SCHEDULE_FILE, data, { spaces: 2 });
    
    if (newSchedule.enabled) {
      const cronExpr = timeToCron(newSchedule.time, newSchedule.days);
      const job = cron.schedule(cronExpr, () => executeSchedule(newSchedule));
      activeJobs.set(newSchedule.id, job);
    }

    res.json({ success: true, schedule: newSchedule });
  } catch (err) {
    console.error('Error creating schedule:', err);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

app.put('/api/schedules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const data = await fs.readJson(SCHEDULE_FILE);
    const scheduleIndex = data.schedules.findIndex(s => s.id === id);
    
    if (scheduleIndex === -1) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    data.schedules[scheduleIndex] = { ...data.schedules[scheduleIndex], ...updateData };
    await fs.writeJson(SCHEDULE_FILE, data, { spaces: 2 });

    const existingJob = activeJobs.get(id);
    if (existingJob) {
      existingJob.stop();
      activeJobs.delete(id);
    }

    const updatedSchedule = data.schedules[scheduleIndex];
    if (updatedSchedule.enabled) {
      const cronExpr = timeToCron(updatedSchedule.time, updatedSchedule.days);
      const job = cron.schedule(cronExpr, () => executeSchedule(updatedSchedule));
      activeJobs.set(id, job);
    }

    res.json({ success: true, schedule: updatedSchedule });
  } catch (err) {
    console.error('Error updating schedule:', err);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

app.delete('/api/schedules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readJson(SCHEDULE_FILE);
    const initialLength = data.schedules.length;
    data.schedules = data.schedules.filter(s => s.id !== id);
    
    if (data.schedules.length === initialLength) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const existingJob = activeJobs.get(id);
    if (existingJob) {
      existingJob.stop();
      activeJobs.delete(id);
    }

    await fs.writeJson(SCHEDULE_FILE, data, { spaces: 2 });
    res.json({ success: true, message: 'Schedule deleted' });
  } catch (err) {
    console.error('Error deleting schedule:', err);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

app.get('/api/groups', async (req, res) => {
  try {
    const data = await fs.readJson(GROUP_FILE);
    res.json(data);
  } catch (err) {
    console.error('Error reading groups:', err);
    res.status(500).json({ error: 'Failed to read groups' });
  }
});

app.post('/api/groups', async (req, res) => {
  try {
    const { group } = req.body;
    if (!group || !group.name || !Array.isArray(group.deviceIds)) {
      return res.status(400).json({ error: 'Invalid group data' });
    }

    const data = await fs.readJson(GROUP_FILE);
    const newGroup = {
      id: `group-${Date.now()}`,
      name: group.name,
      icon: group.icon || '📦',
      color: group.color || '#667eea',
      deviceIds: group.deviceIds,
      roomId: group.roomId,
      createdAt: new Date().toISOString()
    };

    data.groups.push(newGroup);
    await fs.writeJson(GROUP_FILE, data, { spaces: 2 });
    res.json({ success: true, group: newGroup });
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

app.put('/api/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const data = await fs.readJson(GROUP_FILE);
    const groupIndex = data.groups.findIndex(g => g.id === id);
    
    if (groupIndex === -1) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    data.groups[groupIndex] = { ...data.groups[groupIndex], ...updateData };
    await fs.writeJson(GROUP_FILE, data, { spaces: 2 });
    res.json({ success: true, group: data.groups[groupIndex] });
  } catch (err) {
    console.error('Error updating group:', err);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

app.delete('/api/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readJson(GROUP_FILE);
    const initialLength = data.groups.length;
    data.groups = data.groups.filter(g => g.id !== id);
    
    if (data.groups.length === initialLength) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    await fs.writeJson(GROUP_FILE, data, { spaces: 2 });
    res.json({ success: true, message: 'Group deleted' });
  } catch (err) {
    console.error('Error deleting group:', err);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

app.put('/api/groups/:id/state', async (req, res) => {
  try {
    const { id } = req.params;
    const stateUpdate = req.body;
    const groupData = await fs.readJson(GROUP_FILE);
    const group = groupData.groups.find(g => g.id === id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const deviceData = await fs.readJson(DATA_FILE);
    const updatedDevices = [];
    
    group.deviceIds.forEach(deviceId => {
      const deviceIndex = deviceData.devices.findIndex(d => d.id === deviceId);
      if (deviceIndex !== -1) {
        deviceData.devices[deviceIndex].state = {
          ...deviceData.devices[deviceIndex].state,
          ...stateUpdate
        };
        updatedDevices.push(deviceData.devices[deviceIndex]);
      }
    });
    
    await fs.writeJson(DATA_FILE, deviceData, { spaces: 2 });
    res.json({ success: true, updatedDevices, state: stateUpdate });
  } catch (err) {
    console.error('Error updating group state:', err);
    res.status(500).json({ error: 'Failed to update group state' });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const data = await fs.readJson(ROOM_FILE);
    res.json(data);
  } catch (err) {
    console.error('Error reading rooms:', err);
    res.status(500).json({ error: 'Failed to read rooms' });
  }
});

app.post('/api/rooms', async (req, res) => {
  try {
    const { rooms, room } = req.body;
    if (rooms) {
      if (!Array.isArray(rooms)) {
        return res.status(400).json({ error: 'Invalid data format' });
      }
      await fs.writeJson(ROOM_FILE, { rooms }, { spaces: 2 });
      return res.json({ success: true, message: 'Rooms saved successfully' });
    }
    if (room) {
      if (!room || !room.name) {
        return res.status(400).json({ error: 'Invalid room data' });
      }
      const data = await fs.readJson(ROOM_FILE);
      const newRoom = {
        id: `room-${Date.now()}`,
        name: room.name,
        roomType: room.roomType || 'other',
        icon: room.icon || '🏠',
        color: room.color || '#667eea',
        createdAt: new Date().toISOString()
      };
      data.rooms.push(newRoom);
      await fs.writeJson(ROOM_FILE, data, { spaces: 2 });
      return res.json({ success: true, room: newRoom });
    }
    return res.status(400).json({ error: 'Invalid request' });
  } catch (err) {
    console.error('Error saving rooms:', err);
    res.status(500).json({ error: 'Failed to save rooms' });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const data = await fs.readJson(ROOM_FILE);
    const roomIndex = data.rooms.findIndex(r => r.id === id);
    
    if (roomIndex === -1) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    data.rooms[roomIndex] = { ...data.rooms[roomIndex], ...updateData };
    await fs.writeJson(ROOM_FILE, data, { spaces: 2 });
    res.json({ success: true, room: data.rooms[roomIndex] });
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readJson(ROOM_FILE);
    const initialLength = data.rooms.length;
    data.rooms = data.rooms.filter(r => r.id !== id);
    
    if (data.rooms.length === initialLength) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    await fs.writeJson(ROOM_FILE, data, { spaces: 2 });
    res.json({ success: true, message: 'Room deleted' });
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

app.get('/api/scenes', async (req, res) => {
  try {
    const data = await fs.readJson(SCENE_FILE);
    const systemState = await fs.readJson(SYSTEM_STATE_FILE);
    res.json({ ...data, activeSceneId: systemState.activeSceneId });
  } catch (err) {
    console.error('Error reading scenes:', err);
    res.status(500).json({ error: 'Failed to read scenes' });
  }
});

app.post('/api/scenes', async (req, res) => {
  try {
    const { scene } = req.body;
    if (!scene || !scene.name || !Array.isArray(scene.deviceStates)) {
      return res.status(400).json({ error: 'Invalid scene data' });
    }

    const data = await fs.readJson(SCENE_FILE);
    const newScene = {
      id: `scene-${Date.now()}`,
      name: scene.name,
      icon: scene.icon || '🏠',
      color: scene.color || '#6366f1',
      description: scene.description || '',
      deviceStates: scene.deviceStates,
      isPreset: scene.isPreset || false,
      createdAt: new Date().toISOString()
    };

    data.scenes.push(newScene);
    await fs.writeJson(SCENE_FILE, data, { spaces: 2 });
    res.json({ success: true, scene: newScene });
  } catch (err) {
    console.error('Error creating scene:', err);
    res.status(500).json({ error: 'Failed to create scene' });
  }
});

app.put('/api/scenes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const data = await fs.readJson(SCENE_FILE);
    const sceneIndex = data.scenes.findIndex(s => s.id === id);
    
    if (sceneIndex === -1) {
      return res.status(404).json({ error: 'Scene not found' });
    }
    
    data.scenes[sceneIndex] = { ...data.scenes[sceneIndex], ...updateData };
    await fs.writeJson(SCENE_FILE, data, { spaces: 2 });
    res.json({ success: true, scene: data.scenes[sceneIndex] });
  } catch (err) {
    console.error('Error updating scene:', err);
    res.status(500).json({ error: 'Failed to update scene' });
  }
});

app.delete('/api/scenes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readJson(SCENE_FILE);
    const initialLength = data.scenes.length;
    data.scenes = data.scenes.filter(s => s.id !== id && !s.isPreset);
    
    if (data.scenes.length === initialLength) {
      return res.status(404).json({ error: 'Scene not found or is preset' });
    }
    
    await fs.writeJson(SCENE_FILE, data, { spaces: 2 });
    res.json({ success: true, message: 'Scene deleted' });
  } catch (err) {
    console.error('Error deleting scene:', err);
    res.status(500).json({ error: 'Failed to delete scene' });
  }
});

app.post('/api/scenes/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;
    const sceneData = await fs.readJson(SCENE_FILE);
    const scene = sceneData.scenes.find(s => s.id === id);
    
    if (!scene) {
      return res.status(404).json({ error: 'Scene not found' });
    }

    const deviceData = await fs.readJson(DATA_FILE);
    const systemState = await fs.readJson(SYSTEM_STATE_FILE);
    
    const lastDeviceStates = {};
    for (const { deviceId, state } of scene.deviceStates) {
      const deviceIndex = deviceData.devices.findIndex(d => d.id === deviceId);
      if (deviceIndex !== -1) {
        lastDeviceStates[deviceId] = { ...deviceData.devices[deviceIndex].state };
        deviceData.devices[deviceIndex].state = {
          ...deviceData.devices[deviceIndex].state,
          ...state
        };
      }
    }
    
    systemState.lastDeviceStates = { ...systemState.lastDeviceStates, ...lastDeviceStates };
    systemState.activeSceneId = id;
    systemState.activeSceneActivatedAt = new Date().toISOString();
    
    await fs.writeJson(DATA_FILE, deviceData, { spaces: 2 });
    await fs.writeJson(SYSTEM_STATE_FILE, systemState, { spaces: 2 });
    
    console.log(`[${new Date().toLocaleString()}] Activated scene: ${scene.name}`);
    res.json({ 
      success: true, 
      scene, 
      activeSceneId: id,
      activatedAt: systemState.activeSceneActivatedAt,
      lastDeviceStates
    });
  } catch (err) {
    console.error('Error activating scene:', err);
    res.status(500).json({ error: 'Failed to activate scene' });
  }
});

app.post('/api/scenes/deactivate', async (req, res) => {
  try {
    const systemState = await fs.readJson(SYSTEM_STATE_FILE);
    
    if (!systemState.activeSceneId) {
      return res.status(400).json({ error: 'No active scene' });
    }

    const deviceData = await fs.readJson(DATA_FILE);
    
    for (const [deviceId, previousState] of Object.entries(systemState.lastDeviceStates)) {
      const deviceIndex = deviceData.devices.findIndex(d => d.id === deviceId);
      if (deviceIndex !== -1) {
        deviceData.devices[deviceIndex].state = {
          ...deviceData.devices[deviceIndex].state,
          ...previousState
        };
      }
    }
    
    const deactivatedSceneId = systemState.activeSceneId;
    const restoredDeviceIds = Object.keys(systemState.lastDeviceStates || {});
    systemState.activeSceneId = null;
    systemState.activeSceneActivatedAt = null;
    systemState.lastDeviceStates = {};
    
    await fs.writeJson(DATA_FILE, deviceData, { spaces: 2 });
    await fs.writeJson(SYSTEM_STATE_FILE, systemState, { spaces: 2 });
    
    console.log(`[${new Date().toLocaleString()}] Deactivated scene`);
    res.json({ 
      success: true, 
      deactivatedSceneId,
      restoredDevices: restoredDeviceIds
    });
  } catch (err) {
    console.error('Error deactivating scene:', err);
    res.status(500).json({ error: 'Failed to deactivate scene' });
  }
});

app.get('/api/scenes/:id/conflicts', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await checkConflict('scene', id);
    res.json(result);
  } catch (err) {
    console.error('Error checking scene conflicts:', err);
    res.status(500).json({ error: 'Failed to check conflicts' });
  }
});

app.get('/api/automations', async (req, res) => {
  try {
    const data = await fs.readJson(AUTOMATION_FILE);
    res.json(data);
  } catch (err) {
    console.error('Error reading automations:', err);
    res.status(500).json({ error: 'Failed to read automations' });
  }
});

app.post('/api/automations', async (req, res) => {
  try {
    const { automation } = req.body;
    if (!automation || !automation.name || !automation.trigger || !Array.isArray(automation.actions)) {
      return res.status(400).json({ error: 'Invalid automation data' });
    }

    const data = await fs.readJson(AUTOMATION_FILE);
    const newAutomation = {
      id: `automation-${Date.now()}`,
      name: automation.name,
      description: automation.description || '',
      enabled: automation.enabled !== undefined ? automation.enabled : true,
      isPreset: automation.isPreset || false,
      trigger: automation.trigger,
      actions: automation.actions,
      createdAt: new Date().toISOString()
    };

    data.automations.push(newAutomation);
    await fs.writeJson(AUTOMATION_FILE, data, { spaces: 2 });
    
    if (newAutomation.enabled) {
      loadAutomations();
    }
    
    res.json({ success: true, automation: newAutomation });
  } catch (err) {
    console.error('Error creating automation:', err);
    res.status(500).json({ error: 'Failed to create automation' });
  }
});

app.put('/api/automations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const data = await fs.readJson(AUTOMATION_FILE);
    const automationIndex = data.automations.findIndex(a => a.id === id);
    
    if (automationIndex === -1) {
      return res.status(404).json({ error: 'Automation not found' });
    }
    
    data.automations[automationIndex] = { ...data.automations[automationIndex], ...updateData };
    await fs.writeJson(AUTOMATION_FILE, data, { spaces: 2 });
    
    loadAutomations();
    
    res.json({ success: true, automation: data.automations[automationIndex] });
  } catch (err) {
    console.error('Error updating automation:', err);
    res.status(500).json({ error: 'Failed to update automation' });
  }
});

app.delete('/api/automations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readJson(AUTOMATION_FILE);
    const initialLength = data.automations.length;
    data.automations = data.automations.filter(a => a.id !== id && !a.isPreset);
    
    if (data.automations.length === initialLength) {
      return res.status(404).json({ error: 'Automation not found or is preset' });
    }
    
    const existingJob = automationJobs.get(id);
    if (existingJob) {
      existingJob.stop();
      automationJobs.delete(id);
    }
    
    await fs.writeJson(AUTOMATION_FILE, data, { spaces: 2 });
    res.json({ success: true, message: 'Automation deleted' });
  } catch (err) {
    console.error('Error deleting automation:', err);
    res.status(500).json({ error: 'Failed to delete automation' });
  }
});

app.put('/api/automations/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;
    const data = await fs.readJson(AUTOMATION_FILE);
    const automationIndex = data.automations.findIndex(a => a.id === id);
    
    if (automationIndex === -1) {
      return res.status(404).json({ error: 'Automation not found' });
    }
    
    if (enabled === true) {
      const conflictResult = await checkConflict('automation', id);
      if (conflictResult.hasConflict) {
        return res.status(409).json({ 
          error: 'Conflict detected',
          conflict: conflictResult
        });
      }
    }
    
    data.automations[automationIndex].enabled = enabled;
    await fs.writeJson(AUTOMATION_FILE, data, { spaces: 2 });
    
    loadAutomations();
    
    res.json({ 
      success: true, 
      automation: data.automations[automationIndex],
      conflictCheck: enabled ? await checkConflict('automation', id) : null
    });
  } catch (err) {
    console.error('Error toggling automation:', err);
    res.status(500).json({ error: 'Failed to toggle automation' });
  }
});

app.get('/api/automations/:id/conflicts', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await checkConflict('automation', id);
    res.json(result);
  } catch (err) {
    console.error('Error checking automation conflicts:', err);
    res.status(500).json({ error: 'Failed to check conflicts' });
  }
});

app.get('/api/system-state', async (req, res) => {
  try {
    const systemState = await fs.readJson(SYSTEM_STATE_FILE);
    const sceneData = await fs.readJson(SCENE_FILE);
    
    let activeScene = null;
    if (systemState.activeSceneId) {
      activeScene = sceneData.scenes.find(s => s.id === systemState.activeSceneId) || null;
    }
    
    res.json({
      ...systemState,
      activeScene
    });
  } catch (err) {
    console.error('Error reading system state:', err);
    res.status(500).json({ error: 'Failed to read system state' });
  }
});

app.get('/api/conflicts/check', async (req, res) => {
  try {
    const { type, id } = req.query;
    if (!type || !id) {
      return res.status(400).json({ error: 'Missing type or id parameter' });
    }
    const result = await checkConflict(type, id);
    res.json(result);
  } catch (err) {
    console.error('Error checking conflicts:', err);
    res.status(500).json({ error: 'Failed to check conflicts' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    port: PORT, 
    activeSchedules: activeJobs.size,
    activeAutomations: automationJobs.size
  });
});

const start = async () => {
  await ensureDataFile();
  await ensureScheduleFile();
  await ensureGroupFile();
  await ensureRoomFile();
  await ensureSceneFile();
  await ensureAutomationFile();
  await ensureSystemStateFile();
  await loadSchedules();
  await loadAutomations();
  app.listen(PORT, () => {
    console.log(`Smart Home Backend running on http://localhost:${PORT}`);
  });
};

start();
