const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const cron = require('node-cron');

const app = express();
const PORT = 8079;
const DATA_FILE = path.join(__dirname, 'data', 'devices.json');
const SCHEDULE_FILE = path.join(__dirname, 'data', 'schedules.json');

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: PORT, activeSchedules: activeJobs.size });
});

const start = async () => {
  await ensureDataFile();
  await ensureScheduleFile();
  await loadSchedules();
  app.listen(PORT, () => {
    console.log(`Smart Home Backend running on http://localhost:${PORT}`);
  });
};

start();
