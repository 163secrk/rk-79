const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = 8079;
const DATA_FILE = path.join(__dirname, 'data', 'devices.json');

app.use(cors());
app.use(express.json());

const ensureDataFile = async () => {
  const exists = await fs.pathExists(DATA_FILE);
  if (!exists) {
    await fs.outputJson(DATA_FILE, { devices: [] });
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: PORT });
});

const start = async () => {
  await ensureDataFile();
  app.listen(PORT, () => {
    console.log(`Smart Home Backend running on http://localhost:${PORT}`);
  });
};

start();
