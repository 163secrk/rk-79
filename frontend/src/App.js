import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getDevices, saveDevices, updateDeviceState, getSchedules, createSchedule, updateSchedule, deleteSchedule } from './services/api';
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
  const [schedules, setSchedules] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimerRef = useRef(null);
  const lastSavedRef = useRef(null);

  const showMessage = useCallback((text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const performSave = useCallback(async (devicesToSave) => {
    try {
      setIsSaving(true);
      await saveDevices(devicesToSave);
      lastSavedRef.current = Date.now();
    } catch (err) {
      console.error('Auto save failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const autoSave = useCallback((devicesToSave) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      performSave(devicesToSave);
    }, 500);
  }, [performSave]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [devicesData, schedulesData] = await Promise.all([
        getDevices(),
        getSchedules().catch(() => ({ schedules: [] }))
      ]);
      setDevices(devicesData.devices || []);
      setSchedules(schedulesData.schedules || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      showMessage('加载数据失败，使用本地数据', 'warning');
      setDevices(defaultDevices);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadData();
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [loadData]);

  const handleDeviceMove = useCallback((id, position, rotation) => {
    setDevices(prev => {
      const newDevices = prev.map(d => 
        d.id === id ? { ...d, position, rotation } : d
      );
      autoSave(newDevices);
      return newDevices;
    });
  }, [autoSave]);

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
    
    setDevices(prev => {
      const newDevices = [...prev, newDevice];
      autoSave(newDevices);
      return newDevices;
    });
    setSelectedDevice(newDevice);
    showMessage(`已添加 ${newDevice.name}`, 'success');
  }, [autoSave, showMessage]);

  const handleDeleteDevice = useCallback(async (id) => {
    setDevices(prev => {
      const newDevices = prev.filter(d => d.id !== id);
      autoSave(newDevices);
      return newDevices;
    });
    setSelectedDevice(prev => prev?.id === id ? null : prev);
    showMessage('设备已删除', 'info');
  }, [autoSave, showMessage]);

  const handleSave = async () => {
    try {
      await saveDevices(devices);
      showMessage('布局已保存', 'success');
    } catch (err) {
      console.error('Failed to save:', err);
      showMessage('保存失败', 'error');
    }
  };

  const handleAddSchedule = useCallback(async (scheduleData) => {
    try {
      const result = await createSchedule(scheduleData);
      setSchedules(prev => [...prev, result.schedule]);
      showMessage('定时任务已创建', 'success');
      return result.schedule;
    } catch (err) {
      console.error('Failed to create schedule:', err);
      showMessage('创建定时任务失败', 'error');
      throw err;
    }
  }, [showMessage]);

  const handleUpdateSchedule = useCallback(async (id, data) => {
    try {
      const result = await updateSchedule(id, data);
      setSchedules(prev => prev.map(s => s.id === id ? result.schedule : s));
      showMessage('定时任务已更新', 'success');
      return result.schedule;
    } catch (err) {
      console.error('Failed to update schedule:', err);
      showMessage('更新定时任务失败', 'error');
      throw err;
    }
  }, [showMessage]);

  const handleDeleteSchedule = useCallback(async (id) => {
    try {
      await deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
      showMessage('定时任务已删除', 'info');
    } catch (err) {
      console.error('Failed to delete schedule:', err);
      showMessage('删除定时任务失败', 'error');
      throw err;
    }
  }, [showMessage]);

  const getDeviceSchedules = useCallback((deviceId) => {
    return schedules.filter(s => s.deviceId === deviceId);
  }, [schedules]);

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
          <span className={`save-status ${isSaving ? 'saving' : 'saved'}`}>
            {isSaving ? '💾 保存中...' : '✓ 自动保存已开启'}
          </span>
          <button className="btn btn-primary" onClick={handleSave}>
            💾 立即保存
          </button>
          <button className="btn btn-secondary" onClick={loadData}>
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
          schedules={selectedDevice ? getDeviceSchedules(selectedDevice.id) : []}
          onAddSchedule={handleAddSchedule}
          onUpdateSchedule={handleUpdateSchedule}
          onDeleteSchedule={handleDeleteSchedule}
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
