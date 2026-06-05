import React, { useState, useEffect, useCallback } from 'react';
import { getDevices, saveDevices, updateDeviceState } from './services/api';
import Scene3D from './components/Scene3D';
import ControlPanel from './components/ControlPanel';
import DeviceLibrary from './components/DeviceLibrary';
import './App.css';

const defaultDevices = [
  {
    id: 'light-1',
    type: 'light',
    name: '客厅主灯',
    position: { x: 0, y: 2.8, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    state: { on: true, brightness: 80, color: '#ffffff' }
  },
  {
    id: 'ac-1',
    type: 'ac',
    name: '客厅空调',
    position: { x: -3.5, y: 2, z: -3.5 },
    rotation: { x: 0, y: 0.785, z: 0 },
    state: { on: true, temperature: 24, mode: 'cool' }
  },
  {
    id: 'tv-1',
    type: 'tv',
    name: '客厅电视',
    position: { x: 0, y: 1.2, z: -3.8 },
    rotation: { x: 0, y: 0, z: 0 },
    state: { on: false, volume: 50, channel: 1 }
  },
  {
    id: 'light-2',
    type: 'lamp',
    name: '落地灯',
    position: { x: 2.5, y: 0, z: 2 },
    rotation: { x: 0, y: -1.047, z: 0 },
    state: { on: true, brightness: 60, color: '#ffd700' }
  }
];

function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDevices();
      setDevices(data.devices || []);
    } catch (err) {
      console.error('Failed to load devices:', err);
      showMessage('加载设备失败，使用本地数据', 'warning');
      setDevices(defaultDevices);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const handleDeviceMove = useCallback((id, position, rotation) => {
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, position, rotation } : d
    ));
  }, []);

  const handleDeviceSelect = useCallback((device) => {
    setSelectedDevice(device);
  }, []);

  const handleStateChange = useCallback(async (id, state) => {
    try {
      await updateDeviceState(id, state);
      setDevices(prev => prev.map(d => 
        d.id === id ? { ...d, state: { ...d.state, ...state } } : d
      ));
      setSelectedDevice(prev => 
        prev?.id === id ? { ...prev, state: { ...prev.state, ...state } } : prev
      );
    } catch (err) {
      console.error('Failed to update state:', err);
      setDevices(prev => prev.map(d => 
        d.id === id ? { ...d, state: { ...d.state, ...state } } : d
      ));
      setSelectedDevice(prev => 
        prev?.id === id ? { ...prev, state: { ...prev.state, ...state } } : prev
      );
    }
  }, []);

  const getDefaultState = (type) => {
    switch (type) {
      case 'light':
      case 'lamp':
        return { on: true, brightness: 80, color: '#ffffff' };
      case 'ac':
        return { on: false, temperature: 24, mode: 'cool' };
      case 'tv':
        return { on: false, volume: 50, channel: 1 };
      case 'speaker':
        return { on: false, volume: 60 };
      case 'camera':
        return { on: true, recording: false };
      default:
        return { on: false };
    }
  };

  const handleAddDevice = useCallback((deviceType) => {
    const newId = `${deviceType}-${Date.now()}`;
    const typeNames = {
      light: '吸顶灯',
      lamp: '台灯',
      ac: '空调',
      tv: '电视',
      speaker: '音箱',
      camera: '摄像头'
    };
    
    const newDevice = {
      id: newId,
      type: deviceType,
      name: typeNames[deviceType] || deviceType,
      position: { x: 0, y: 1.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      state: getDefaultState(deviceType)
    };
    
    setDevices(prev => [...prev, newDevice]);
    setSelectedDevice(newDevice);
    showMessage(`已添加 ${newDevice.name}`, 'success');
  }, [showMessage]);

  const handleDeleteDevice = useCallback(async (id) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    setSelectedDevice(prev => prev?.id === id ? null : prev);
    showMessage('设备已删除', 'info');
  }, [showMessage]);

  const handleSave = async () => {
    try {
      await saveDevices(devices);
      showMessage('布局已保存', 'success');
    } catch (err) {
      console.error('Failed to save:', err);
      showMessage('保存失败', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>🏠 3D智能家居控制系统</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            💾 保存布局
          </button>
          <button className="btn btn-secondary" onClick={loadDevices}>
            🔄 刷新
          </button>
        </div>
      </div>

      <div className="main-content">
        <DeviceLibrary onAddDevice={handleAddDevice} />
        
        <div className="scene-container">
          <Scene3D
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceMove={handleDeviceMove}
            onDeviceSelect={handleDeviceSelect}
          />
        </div>

        <ControlPanel
          device={selectedDevice}
          onStateChange={handleStateChange}
          onDelete={handleDeleteDevice}
          onClose={() => setSelectedDevice(null)}
        />
      </div>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default App;
