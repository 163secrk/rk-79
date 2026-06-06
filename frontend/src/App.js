import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getDevices, saveDevices, updateDeviceState, getSchedules, createSchedule, updateSchedule, deleteSchedule, getGroups, createGroup, updateGroup, deleteGroup, updateGroupState } from './services/api';
import Scene3D from './components/Scene3D';
import ControlPanel from './components/ControlPanel';
import DeviceLibrary from './components/DeviceLibrary';
import EnergyDashboard from './components/EnergyDashboard';
import GroupPanel from './components/GroupPanel';
import GroupManager from './components/GroupManager';
import './App.css';

const defaultDevices = [
  {
    id: 'light-1',
    type: 'light',
    name: '客厅主灯',
    ratedPower: 30,
    position: { x: 0, y: 2.8, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    state: { on: true, brightness: 80, color: '#ffffff' }
  },
  {
    id: 'ac-1',
    type: 'ac',
    name: '客厅空调',
    ratedPower: 1500,
    position: { x: -3.5, y: 2, z: -3.5 },
    rotation: { x: 0, y: 0.785, z: 0 },
    state: { on: true, temperature: 24, mode: 'cool' }
  },
  {
    id: 'tv-1',
    type: 'tv',
    name: '客厅电视',
    ratedPower: 100,
    position: { x: 0, y: 1.2, z: -3.8 },
    rotation: { x: 0, y: 0, z: 0 },
    state: { on: false, volume: 50, channel: 1 }
  },
  {
    id: 'light-2',
    type: 'lamp',
    name: '落地灯',
    ratedPower: 15,
    position: { x: 2.5, y: 0, z: 2 },
    rotation: { x: 0, y: -1.047, z: 0 },
    state: { on: true, brightness: 60, color: '#ffd700' }
  }
];

const deviceRatedPower = {
  light: 30,
  lamp: 15,
  ac: 1500,
  tv: 100,
  speaker: 50,
  camera: 10
};

const defaultGroups = [
  {
    id: 'group-default-lights',
    name: '客厅灯组',
    icon: '💡',
    color: '#fbbf24',
    deviceIds: ['light-1', 'light-2'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'group-default-acs',
    name: '所有空调',
    icon: '❄️',
    color: '#3b82f6',
    deviceIds: ['ac-1'],
    createdAt: new Date().toISOString()
  }
];

function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showGroupManager, setShowGroupManager] = useState(false);
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
      const [devicesData, schedulesData, groupsData] = await Promise.all([
        getDevices(),
        getSchedules().catch(() => ({ schedules: [] })),
        getGroups().catch(() => ({ groups: [] }))
      ]);
      setDevices(devicesData.devices || []);
      setSchedules(schedulesData.schedules || []);
      const loadedGroups = groupsData.groups || [];
      setGroups(loadedGroups.length > 0 ? loadedGroups : defaultGroups);
    } catch (err) {
      console.error('Failed to load data:', err);
      showMessage('加载数据失败，使用本地数据', 'warning');
      setDevices(defaultDevices);
      setGroups(defaultGroups);
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
      ratedPower: deviceRatedPower[deviceType] || 0,
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
    setGroups(prev => prev.map(g => ({
      ...g,
      deviceIds: g.deviceIds.filter(did => did !== id)
    })));
    showMessage('设备已删除', 'info');
  }, [autoSave, showMessage]);

  const handleGroupSelect = useCallback((group) => {
    setSelectedGroup(group);
    setSelectedDevice(null);
  }, []);

  const handleGroupStateChange = useCallback(async (groupId, state) => {
    try {
      await updateGroupState(groupId, state);
      const group = groups.find(g => g.id === groupId);
      if (group) {
        setDevices(prev => prev.map(d =>
          group.deviceIds.includes(d.id)
            ? { ...d, state: { ...d.state, ...state } }
            : d
        ));
        setSelectedGroup(prev =>
          prev?.id === groupId
            ? { ...prev, deviceIds: prev.deviceIds }
            : prev
        );
      }
      showMessage(`已${state.on ? '开启' : '关闭'} ${group?.name || '分组'}`, 'success');
    } catch (err) {
      console.error('Failed to update group state:', err);
      const group = groups.find(g => g.id === groupId);
      if (group) {
        setDevices(prev => prev.map(d =>
          group.deviceIds.includes(d.id)
            ? { ...d, state: { ...d.state, ...state } }
            : d
        ));
      }
      showMessage(`已${state.on ? '开启' : '关闭'} ${group?.name || '分组'}`, 'success');
    }
  }, [groups, showMessage]);

  const handleCreateGroup = useCallback(async (groupData) => {
    try {
      const result = await createGroup(groupData);
      setGroups(prev => [...prev, result.group]);
      showMessage(`分组 "${result.group.name}" 已创建`, 'success');
      return result.group;
    } catch (err) {
      console.error('Failed to create group:', err);
      showMessage('创建分组失败', 'error');
      throw err;
    }
  }, [showMessage]);

  const handleUpdateGroup = useCallback(async (id, data) => {
    try {
      const result = await updateGroup(id, data);
      setGroups(prev => prev.map(g => g.id === id ? result.group : g));
      setSelectedGroup(prev => prev?.id === id ? result.group : prev);
      showMessage('分组已更新', 'success');
      return result.group;
    } catch (err) {
      console.error('Failed to update group:', err);
      showMessage('更新分组失败', 'error');
      throw err;
    }
  }, [showMessage]);

  const handleDeleteGroup = useCallback(async (id) => {
    try {
      await deleteGroup(id);
      setGroups(prev => prev.filter(g => g.id !== id));
      setSelectedGroup(prev => prev?.id === id ? null : prev);
      showMessage('分组已删除', 'info');
    } catch (err) {
      console.error('Failed to delete group:', err);
      setGroups(prev => prev.filter(g => g.id !== id));
      setSelectedGroup(prev => prev?.id === id ? null : prev);
      showMessage('分组已删除', 'info');
    }
  }, [showMessage]);

  const getGroupDevices = useCallback((groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
    return devices.filter(d => group.deviceIds.includes(d.id));
  }, [groups, devices]);

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

  const handleCloseSelection = () => {
    setSelectedDevice(null);
    setSelectedGroup(null);
  };

  const handleSceneClick = () => {
    setSelectedDevice(null);
    setSelectedGroup(null);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>🏠 3D智能家居控制系统</h1>
        <div className="header-actions">
          <span className={`save-status ${isSaving ? 'saving' : 'saved'}`}>
            {isSaving ? '💾 保存中...' : '✓ 自动保存已开启'}
          </span>
          <button className="btn btn-secondary" onClick={() => setShowGroupManager(true)}>
            👥 分组管理
          </button>
          <button className={`btn ${showDashboard ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowDashboard(!showDashboard)}>
            ⚡ {showDashboard ? '隐藏能耗' : '显示能耗'}
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            💾 立即保存
          </button>
          <button className="btn btn-secondary" onClick={loadData}>
            🔄 刷新
          </button>
        </div>
      </div>

      <div className="main-content">
        <DeviceLibrary
          onAddDevice={handleAddDevice}
          groups={groups}
          selectedGroup={selectedGroup}
          onGroupSelect={handleGroupSelect}
          onManageGroups={() => setShowGroupManager(true)}
        />
        
        <div className="scene-container" onClick={handleSceneClick}>
          <Scene3D
            devices={devices}
            selectedDevice={selectedDevice}
            selectedGroup={selectedGroup}
            onDeviceMove={handleDeviceMove}
            onDeviceSelect={handleDeviceSelect}
            onGroupSelect={handleGroupSelect}
          />
          {showDashboard && (
            <div className="dashboard-overlay">
              <EnergyDashboard devices={devices} />
            </div>
          )}
        </div>

        {selectedGroup ? (
          <GroupPanel
            group={selectedGroup}
            devices={getGroupDevices(selectedGroup.id)}
            onStateChange={(state) => handleGroupStateChange(selectedGroup.id, state)}
            onDelete={() => handleDeleteGroup(selectedGroup.id)}
            onClose={handleCloseSelection}
            onEdit={() => setShowGroupManager(true)}
          />
        ) : (
          <ControlPanel
            device={selectedDevice}
            onStateChange={handleStateChange}
            onDelete={handleDeleteDevice}
            onClose={handleCloseSelection}
            schedules={selectedDevice ? getDeviceSchedules(selectedDevice.id) : []}
            onAddSchedule={handleAddSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        )}
      </div>

      {showGroupManager && (
        <div className="modal-overlay" onClick={() => setShowGroupManager(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <GroupManager
              groups={groups}
              devices={devices}
              onCreateGroup={handleCreateGroup}
              onUpdateGroup={handleUpdateGroup}
              onDeleteGroup={handleDeleteGroup}
              onClose={() => setShowGroupManager(false)}
            />
          </div>
        </div>
      )}

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default App;
