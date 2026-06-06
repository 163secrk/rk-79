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

const activeJobs = new Map();

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: PORT, activeSchedules: activeJobs.size });
});

const start = async () => {
  await ensureDataFile();
  await ensureScheduleFile();
  await ensureGroupFile();
  await ensureRoomFile();
  await loadSchedules();
  app.listen(PORT, () => {
    console.log(`Smart Home Backend running on http://localhost:${PORT}`);
  });
};

start();
