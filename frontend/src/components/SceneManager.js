import React, { useState } from 'react';

const presetIcons = ['🌙', '☀️', '🚪', '🎬', '🏠', '🎮', '📖', '🍽️', '🎉', '💤', '🌸', '❄️'];
const presetColors = ['#6366f1', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6', '#3b82f6', '#f97316', '#14b8a6', '#64748b', '#ef4444'];

const typeIcons = {
  light: '💡',
  lamp: '🪔',
  ac: '❄️',
  tv: '📺',
  speaker: '🔊',
  camera: '📷',
  fridge: '🧊',
  curtain: '🪟'
};

const defaultStateByType = {
  light: { on: false, brightness: 80, color: '#ffffff' },
  lamp: { on: false, brightness: 60, color: '#ffd700' },
  ac: { on: false, temperature: 24, mode: 'cool' },
  tv: { on: false, volume: 50, channel: 1 },
  speaker: { on: false, volume: 40 },
  camera: { on: true, recording: false },
  fridge: { on: true, temperature: 4 },
  curtain: { on: true, openPercent: 70 }
};

function SceneForm({ scene, devices, onSubmit, onCancel, isEdit }) {
  const [name, setName] = useState(scene?.name || '');
  const [icon, setIcon] = useState(scene?.icon || '🏠');
  const [color, setColor] = useState(scene?.color || '#6366f1');
  const [description, setDescription] = useState(scene?.description || '');
  const [deviceStates, setDeviceStates] = useState(scene?.deviceStates || []);

  const toggleDevice = (deviceId) => {
    setDeviceStates(prev => {
      const existing = prev.find(ds => ds.deviceId === deviceId);
      if (existing) {
        return prev.filter(ds => ds.deviceId !== deviceId);
      } else {
        const device = devices.find(d => d.id === deviceId);
        const defaultState = defaultStateByType[device?.type] || { on: true };
        return [...prev, { deviceId, state: { ...defaultState } }];
      }
    });
  };

  const updateDeviceState = (deviceId, state) => {
    setDeviceStates(prev => prev.map(ds =>
      ds.deviceId === deviceId ? { ...ds, state: { ...ds.state, ...state } } : ds
    ));
  };

  const selectAll = () => {
    const newDeviceStates = devices.map(d => {
      const existing = deviceStates.find(ds => ds.deviceId === d.id);
      return existing || { deviceId: d.id, state: { ...defaultStateByType[d.type] } };
    });
    setDeviceStates(newDeviceStates);
  };

  const clearAll = () => {
    setDeviceStates([]);
  };

  const useCurrentStates = () => {
    const newDeviceStates = devices.map(d => ({
      deviceId: d.id,
      state: { ...d.state }
    }));
    setDeviceStates(newDeviceStates);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      icon,
      color,
      description: description.trim(),
      deviceStates
    });
  };

  const getDeviceState = (deviceId) => {
    return deviceStates.find(ds => ds.deviceId === deviceId)?.state;
  };

  const isDeviceSelected = (deviceId) => {
    return deviceStates.some(ds => ds.deviceId === deviceId);
  };

  return (
    <form className="scene-form" onSubmit={handleSubmit}>
      <div className="control-section">
        <h4>{isEdit ? '编辑场景' : '创建场景'}</h4>
        
        <div className="form-group">
          <label>场景名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：睡眠模式"
            className="form-input"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>场景描述</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例如：关闭所有灯光，调暗空调"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>选择图标</label>
          <div className="icon-picker">
            {presetIcons.map((i) => (
              <button
                key={i}
                type="button"
                className={`icon-btn ${icon === i ? 'active' : ''}`}
                onClick={() => setIcon(i)}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>选择颜色</label>
          <div className="color-picker-grid">
            {presetColors.map((c) => (
              <button
                key={c}
                type="button"
                className={`color-btn ${color === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <div className="control-row">
            <label>选择设备 ({deviceStates.length}个)</label>
            <div className="btn-group">
              <button type="button" className="btn btn-secondary btn-small" onClick={useCurrentStates}>使用当前状态</button>
              <button type="button" className="btn btn-secondary btn-small" onClick={selectAll}>全选</button>
              <button type="button" className="btn btn-secondary btn-small" onClick={clearAll}>清空</button>
            </div>
          </div>
          <div className="device-select-list">
            {devices.length === 0 ? (
              <p className="empty-hint">暂无可用设备</p>
            ) : (
              devices.map((device) => {
                const selected = isDeviceSelected(device.id);
                const state = getDeviceState(device.id);
                return (
                  <div key={device.id}>
                    <div
                      className={`device-select-item ${selected ? 'selected' : ''}`}
                      onClick={() => toggleDevice(device.id)}
                    >
                      <span className="device-icon">{typeIcons[device.type] || '📱'}</span>
                      <span className="device-name">{device.name}</span>
                      <span className="device-check">{selected ? '✓' : ''}</span>
                    </div>
                    {selected && state && (
                      <div className="device-state-editor">
                        <div className="control-row">
                          <label>开关</label>
                          <div
                            className={`switch small ${state.on ? 'active' : ''}`}
                            onClick={() => updateDeviceState(device.id, { on: !state.on })}
                          >
                            <div className="switch-knob"></div>
                          </div>
                        </div>
                        {state.on && (
                          <>
                            {device.type === 'light' || device.type === 'lamp' ? (
                              <>
                                <div className="control-row">
                                  <label>亮度</label>
                                  <div className="slider-container">
                                    <input
                                      type="range"
                                      min="1"
                                      max="100"
                                      value={state.brightness || 80}
                                      onChange={(e) => updateDeviceState(device.id, { brightness: parseInt(e.target.value) })}
                                    />
                                    <div className="slider-value">
                                      <span>1%</span>
                                      <span>{state.brightness || 80}%</span>
                                      <span>100%</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="control-row">
                                  <label>颜色</label>
                                  <input
                                    type="color"
                                    className="color-picker"
                                    value={state.color || '#ffffff'}
                                    onChange={(e) => updateDeviceState(device.id, { color: e.target.value })}
                                  />
                                </div>
                              </>
                            ) : null}
                            {device.type === 'ac' ? (
                              <>
                                <div className="control-row">
                                  <label>温度</label>
                                  <div className="slider-container">
                                    <input
                                      type="range"
                                      min="16"
                                      max="30"
                                      value={state.temperature || 24}
                                      onChange={(e) => updateDeviceState(device.id, { temperature: parseInt(e.target.value) })}
                                    />
                                    <div className="slider-value">
                                      <span>16°C</span>
                                      <span>{state.temperature || 24}°C</span>
                                      <span>30°C</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="control-row">
                                  <label>模式</label>
                                  <div className="mode-selector">
                                    <button
                                      type="button"
                                      className={`mode-btn ${state.mode === 'cool' ? 'active' : ''}`}
                                      onClick={() => updateDeviceState(device.id, { mode: 'cool' })}
                                    >
                                      ❄️ 制冷
                                    </button>
                                    <button
                                      type="button"
                                      className={`mode-btn ${state.mode === 'heat' ? 'active' : ''}`}
                                      onClick={() => updateDeviceState(device.id, { mode: 'heat' })}
                                    >
                                      🔥 制热
                                    </button>
                                    <button
                                      type="button"
                                      className={`mode-btn ${state.mode === 'auto' ? 'active' : ''}`}
                                      onClick={() => updateDeviceState(device.id, { mode: 'auto' })}
                                    >
                                      🔄 自动
                                    </button>
                                  </div>
                                </div>
                              </>
                            ) : null}
                            {device.type === 'tv' || device.type === 'speaker' ? (
                              <div className="control-row">
                                <label>音量</label>
                                <div className="slider-container">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={state.volume || 50}
                                    onChange={(e) => updateDeviceState(device.id, { volume: parseInt(e.target.value) })}
                                  />
                                  <div className="slider-value">
                                    <span>0</span>
                                    <span>{state.volume || 50}</span>
                                    <span>100</span>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            {device.type === 'camera' ? (
                              <div className="control-row">
                                <label>录像</label>
                                <div
                                  className={`switch small ${state.recording ? 'active' : ''}`}
                                  onClick={() => updateDeviceState(device.id, { recording: !state.recording })}
                                >
                                  <div className="switch-knob"></div>
                                </div>
                              </div>
                            ) : null}
                            {device.type === 'curtain' ? (
                              <div className="control-row">
                                <label>开启程度</label>
                                <div className="slider-container">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={state.openPercent || 70}
                                    onChange={(e) => updateDeviceState(device.id, { openPercent: parseInt(e.target.value) })}
                                  />
                                  <div className="slider-value">
                                    <span>0%</span>
                                    <span>{state.openPercent || 70}%</span>
                                    <span>100%</span>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            取消
          </button>
          <button type="submit" className="btn btn-primary" disabled={!name.trim() || deviceStates.length === 0}>
            {isEdit ? '保存修改' : '创建场景'}
          </button>
        </div>
      </div>
    </form>
  );
}

function SceneList({ scenes, devices, onEdit, onDelete, onActivate, onDeactivate, activeSceneId }) {
  if (scenes.length === 0) {
    return (
      <div className="empty-schedules">
        <p>暂无场景</p>
        <p className="hint">点击下方按钮创建新场景</p>
      </div>
    );
  }

  const getSceneDeviceCount = (scene) => {
    return devices.filter(d => scene.deviceStates.some(ds => ds.deviceId === d.id)).length;
  };

  const activeScene = scenes.find(s => s.id === activeSceneId);

  return (
    <div className="scene-list">
      {activeScene && (
        <div className="active-scene-notice" style={{ borderLeftColor: activeScene.color }}>
          <span className="active-scene-notice-icon" style={{ backgroundColor: activeScene.color + '20', color: activeScene.color }}>
            {activeScene.icon}
          </span>
          <div className="active-scene-notice-info">
            <strong>当前场景: {activeScene.name}</strong>
            <p>激活后所有相关自动化规则将暂停执行</p>
          </div>
          <button className="btn btn-small btn-danger" onClick={onDeactivate}>
            ✕ 退出场景
          </button>
        </div>
      )}
      {scenes.map((scene) => {
        const isActive = activeSceneId === scene.id;
        return (
          <div
            key={scene.id}
            className={`scene-card ${isActive ? 'active' : ''}`}
            style={{ borderLeftColor: scene.color }}
          >
            <div className="scene-card-header">
              <div className="scene-card-title">
                <span className="scene-icon" style={{ backgroundColor: scene.color + '20', color: scene.color }}>
                  {scene.icon}
                </span>
                <div>
                  <h4>
                    {scene.name} 
                    {scene.isPreset && <span className="preset-badge">预置</span>}
                    {isActive && <span className="active-badge" style={{ backgroundColor: scene.color }}>运行中</span>}
                  </h4>
                  <p className="scene-meta">
                    {getSceneDeviceCount(scene)} 个设备 · {scene.description}
                  </p>
                </div>
              </div>
              <div className="scene-card-actions">
                {isActive ? (
                  <button className="btn-icon" onClick={onDeactivate} title="退出场景">
                    ⏹️
                  </button>
                ) : (
                  <button className="btn-icon" onClick={() => onActivate(scene.id)} title="激活">
                    ▶️
                  </button>
                )}
                <button className="btn-icon" onClick={() => onEdit(scene)} title="编辑">
                  ✏️
                </button>
                {!scene.isPreset && (
                  <button className="btn-icon delete" onClick={() => onDelete(scene.id)} title="删除">
                    🗑️
                  </button>
                )}
              </div>
            </div>
            <div className="scene-device-preview">
              {scene.deviceStates.slice(0, 6).map(({ deviceId, state }) => {
                const device = devices.find(d => d.id === deviceId);
                if (!device) return null;
                return (
                  <span
                    key={deviceId}
                    className={`scene-device-tag ${state.on ? 'on' : 'off'}`}
                    title={`${device.name}: ${state.on ? '开启' : '关闭'}`}
                  >
                    {typeIcons[device.type] || '📱'} {device.name}
                  </span>
                );
              })}
              {scene.deviceStates.length > 6 && (
                <span className="scene-device-tag more">
                  +{scene.deviceStates.length - 6}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SceneManager({ scenes, devices, onCreateScene, onUpdateScene, onDeleteScene, onActivateScene, onDeactivateScene, onClose, activeSceneId }) {
  const [mode, setMode] = useState('list');
  const [editingScene, setEditingScene] = useState(null);

  const handleCreate = (data) => {
    onCreateScene(data);
    setMode('list');
  };

  const handleUpdate = (data) => {
    onUpdateScene(editingScene.id, data);
    setMode('list');
    setEditingScene(null);
  };

  const handleEdit = (scene) => {
    setEditingScene(scene);
    setMode('form');
  };

  const handleCancel = () => {
    setMode('list');
    setEditingScene(null);
  };

  return (
    <div className="scene-manager">
      <div className="modal-header">
        <h3>🎬 场景管理</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="modal-body">
        {mode === 'list' && (
          <>
            <SceneList
              scenes={scenes}
              devices={devices}
              onEdit={handleEdit}
              onDelete={onDeleteScene}
              onActivate={onActivateScene}
              onDeactivate={onDeactivateScene}
              activeSceneId={activeSceneId}
            />
            <button
              className="btn btn-primary add-schedule-btn"
              onClick={() => setMode('form')}
            >
              ➕ 创建新场景
            </button>
          </>
        )}

        {mode === 'form' && (
          <SceneForm
            scene={editingScene}
            devices={devices}
            onSubmit={editingScene ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEdit={!!editingScene}
          />
        )}
      </div>
    </div>
  );
}

export default SceneManager;
