import React, { useState } from 'react';

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

const triggerConditions = [
  { value: 'temperature_above', label: '温度高于', type: 'ac', unit: '°C' },
  { value: 'temperature_below', label: '温度低于', type: 'ac', unit: '°C' },
  { value: 'on', label: '设备开启', type: 'any' },
  { value: 'off', label: '设备关闭', type: 'any' }
];

const triggerTypes = [
  { value: 'device_state', label: '设备状态变化' },
  { value: 'time', label: '定时触发' }
];

function AutomationForm({ automation, devices, onSubmit, onCancel, isEdit }) {
  const [name, setName] = useState(automation?.name || '');
  const [description, setDescription] = useState(automation?.description || '');
  const [enabled, setEnabled] = useState(automation?.enabled !== false);
  const [triggerType, setTriggerType] = useState(automation?.trigger?.type || 'device_state');
  const [triggerDeviceId, setTriggerDeviceId] = useState(automation?.trigger?.deviceId || devices[0]?.id || '');
  const [triggerCondition, setTriggerCondition] = useState(automation?.trigger?.condition || 'temperature_above');
  const [triggerValue, setTriggerValue] = useState(automation?.trigger?.value || 28);
  const [triggerTime, setTriggerTime] = useState(automation?.trigger?.value || '08:00');
  const [actions, setActions] = useState(automation?.actions || []);

  const toggleActionDevice = (deviceId) => {
    setActions(prev => {
      const existing = prev.find(a => a.deviceId === deviceId);
      if (existing) {
        return prev.filter(a => a.deviceId !== deviceId);
      } else {
        const device = devices.find(d => d.id === deviceId);
        const defaultState = defaultStateByType[device?.type] || { on: true };
        return [...prev, { deviceId, state: { ...defaultState } }];
      }
    });
  };

  const updateActionState = (deviceId, state) => {
    setActions(prev => prev.map(a =>
      a.deviceId === deviceId ? { ...a, state: { ...a.state, ...state } } : a
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || actions.length === 0) return;

    let trigger;
    if (triggerType === 'time') {
      trigger = {
        type: 'time',
        condition: 'time_equals',
        value: triggerTime
      };
    } else {
      trigger = {
        type: 'device_state',
        deviceId: triggerDeviceId,
        condition: triggerCondition,
        value: triggerValue
      };
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      enabled,
      trigger,
      actions
    });
  };

  const getActionState = (deviceId) => {
    return actions.find(a => a.deviceId === deviceId)?.state;
  };

  const isActionDeviceSelected = (deviceId) => {
    return actions.some(a => a.deviceId === deviceId);
  };

  const availableConditions = triggerType === 'device_state' 
    ? triggerConditions.filter(c => {
        const device = devices.find(d => d.id === triggerDeviceId);
        return c.type === 'any' || c.type === device?.type;
      })
    : [];

  const selectedCondition = availableConditions.find(c => c.value === triggerCondition);

  return (
    <form className="automation-form" onSubmit={handleSubmit}>
      <div className="control-section">
        <h4>{isEdit ? '编辑自动化规则' : '创建自动化规则'}</h4>
        
        <div className="form-group">
          <label>规则名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：高温自动开空调"
            className="form-input"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>规则描述</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例如：当温度高于28度时自动开启空调"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <div className="control-row">
            <label>启用规则</label>
            <div
              className={`switch small ${enabled ? 'active' : ''}`}
              onClick={() => setEnabled(!enabled)}
            >
              <div className="switch-knob"></div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>触发类型 (IF)</label>
          <div className="mode-selector">
            {triggerTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`mode-btn ${triggerType === type.value ? 'active' : ''}`}
                onClick={() => setTriggerType(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {triggerType === 'device_state' ? (
          <>
            <div className="form-group">
              <label>选择触发设备</label>
              <select
                className="form-input"
                value={triggerDeviceId}
                onChange={(e) => setTriggerDeviceId(e.target.value)}
              >
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {typeIcons[device.type] || '📱'} {device.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>触发条件</label>
              <div className="mode-selector">
                {availableConditions.map((cond) => (
                  <button
                    key={cond.value}
                    type="button"
                    className={`mode-btn ${triggerCondition === cond.value ? 'active' : ''}`}
                    onClick={() => {
                      setTriggerCondition(cond.value);
                      if (cond.type === 'ac') {
                        setTriggerValue(28);
                      }
                    }}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedCondition && selectedCondition.type === 'ac' && (
              <div className="form-group">
                <label>阈值 ({selectedCondition.unit})</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="16"
                    max="35"
                    value={triggerValue}
                    onChange={(e) => setTriggerValue(parseInt(e.target.value))}
                  />
                  <div className="slider-value">
                    <span>16°C</span>
                    <span>{triggerValue}°C</span>
                    <span>35°C</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="form-group">
            <label>触发时间</label>
            <input
              type="time"
              className="form-input"
              value={triggerTime}
              onChange={(e) => setTriggerTime(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label>执行动作 (THEN) - {actions.length} 个设备</label>
          <div className="device-select-list">
            {devices.length === 0 ? (
              <p className="empty-hint">暂无可用设备</p>
            ) : (
              devices.map((device) => {
                const selected = isActionDeviceSelected(device.id);
                const state = getActionState(device.id);
                return (
                  <div key={device.id}>
                    <div
                      className={`device-select-item ${selected ? 'selected' : ''}`}
                      onClick={() => toggleActionDevice(device.id)}
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
                            onClick={() => updateActionState(device.id, { on: !state.on })}
                          >
                            <div className="switch-knob"></div>
                          </div>
                        </div>
                        {state.on && (
                          <>
                            {(device.type === 'light' || device.type === 'lamp') && (
                              <>
                                <div className="control-row">
                                  <label>亮度</label>
                                  <div className="slider-container">
                                    <input
                                      type="range"
                                      min="1"
                                      max="100"
                                      value={state.brightness || 80}
                                      onChange={(e) => updateActionState(device.id, { brightness: parseInt(e.target.value) })}
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
                                    onChange={(e) => updateActionState(device.id, { color: e.target.value })}
                                  />
                                </div>
                              </>
                            )}
                            {device.type === 'ac' && (
                              <>
                                <div className="control-row">
                                  <label>温度</label>
                                  <div className="slider-container">
                                    <input
                                      type="range"
                                      min="16"
                                      max="30"
                                      value={state.temperature || 24}
                                      onChange={(e) => updateActionState(device.id, { temperature: parseInt(e.target.value) })}
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
                                      onClick={() => updateActionState(device.id, { mode: 'cool' })}
                                    >
                                      ❄️ 制冷
                                    </button>
                                    <button
                                      type="button"
                                      className={`mode-btn ${state.mode === 'heat' ? 'active' : ''}`}
                                      onClick={() => updateActionState(device.id, { mode: 'heat' })}
                                    >
                                      🔥 制热
                                    </button>
                                    <button
                                      type="button"
                                      className={`mode-btn ${state.mode === 'auto' ? 'active' : ''}`}
                                      onClick={() => updateActionState(device.id, { mode: 'auto' })}
                                    >
                                      🔄 自动
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                            {(device.type === 'tv' || device.type === 'speaker') && (
                              <div className="control-row">
                                <label>音量</label>
                                <div className="slider-container">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={state.volume || 50}
                                    onChange={(e) => updateActionState(device.id, { volume: parseInt(e.target.value) })}
                                  />
                                  <div className="slider-value">
                                    <span>0</span>
                                    <span>{state.volume || 50}</span>
                                    <span>100</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {device.type === 'camera' && (
                              <div className="control-row">
                                <label>录像</label>
                                <div
                                  className={`switch small ${state.recording ? 'active' : ''}`}
                                  onClick={() => updateActionState(device.id, { recording: !state.recording })}
                                >
                                  <div className="switch-knob"></div>
                                </div>
                              </div>
                            )}
                            {device.type === 'curtain' && (
                              <div className="control-row">
                                <label>开启程度</label>
                                <div className="slider-container">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={state.openPercent || 70}
                                    onChange={(e) => updateActionState(device.id, { openPercent: parseInt(e.target.value) })}
                                  />
                                  <div className="slider-value">
                                    <span>0%</span>
                                    <span>{state.openPercent || 70}%</span>
                                    <span>100%</span>
                                  </div>
                                </div>
                              </div>
                            )}
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
          <button type="submit" className="btn btn-primary" disabled={!name.trim() || actions.length === 0}>
            {isEdit ? '保存修改' : '创建规则'}
          </button>
        </div>
      </div>
    </form>
  );
}

function AutomationList({ automations, devices, onEdit, onDelete, onToggle, activeSceneId, scenes }) {
  if (automations.length === 0) {
    return (
      <div className="empty-schedules">
        <p>暂无自动化规则</p>
        <p className="hint">点击下方按钮创建新规则</p>
      </div>
    );
  }

  const activeScene = scenes.find(s => s.id === activeSceneId);

  const hasConflict = (automation) => {
    if (!activeSceneId || !automation.enabled) return false;
    const automationDeviceIds = automation.actions.map(a => a.deviceId);
    const scene = scenes.find(s => s.id === activeSceneId);
    if (!scene) return false;
    const sceneDeviceIds = scene.deviceStates.map(ds => ds.deviceId);
    return automationDeviceIds.some(id => sceneDeviceIds.includes(id));
  };

  const getConflictDevices = (automation) => {
    if (!activeSceneId) return [];
    const automationDeviceIds = automation.actions.map(a => a.deviceId);
    const scene = scenes.find(s => s.id === activeSceneId);
    if (!scene) return [];
    const sceneDeviceIds = scene.deviceStates.map(ds => ds.deviceId);
    const overlappingIds = automationDeviceIds.filter(id => sceneDeviceIds.includes(id));
    return overlappingIds.map(id => {
      const device = devices.find(d => d.id === id);
      return device ? device.name : id;
    });
  };

  const getTriggerDescription = (trigger) => {
    if (trigger.type === 'time') {
      return `⏰ 每天 ${trigger.value} 触发`;
    }
    const device = devices.find(d => d.id === trigger.deviceId);
    if (!device) return '未知触发条件';
    
    const deviceLabel = `${typeIcons[device.type] || '📱'} ${device.name}`;
    
    switch (trigger.condition) {
      case 'temperature_above':
        return `${deviceLabel} 温度高于 ${trigger.value}°C`;
      case 'temperature_below':
        return `${deviceLabel} 温度低于 ${trigger.value}°C`;
      case 'on':
        return `${deviceLabel} 已开启`;
      case 'off':
        return `${deviceLabel} 已关闭`;
      default:
        return `${deviceLabel} 状态变化`;
    }
  };

  return (
    <div className="automation-list">
      {activeScene && (
        <div className="conflict-notice">
          <span className="conflict-icon">⚠️</span>
          <div>
            <strong>场景"{activeScene.name}"正在运行</strong>
            <p>启用与场景冲突的规则将自动退出当前场景</p>
          </div>
        </div>
      )}
      {automations.map((automation) => {
        const conflict = hasConflict(automation);
        const conflictDevices = getConflictDevices(automation);
        return (
          <div
            key={automation.id}
            className={`automation-card ${automation.enabled ? '' : 'disabled'} ${conflict ? 'has-conflict' : ''}`}
          >
            <div className="automation-card-header">
              <div className="automation-card-title">
                <div>
                  <h4>
                    {automation.name} {automation.isPreset && <span className="preset-badge">预置</span>}
                  </h4>
                  <p className="automation-meta">{automation.description}</p>
                  {conflict && (
                    <p className="conflict-warning">
                      ⚠️ 与场景"{activeScene?.name}"冲突设备: {conflictDevices.join('、')}
                    </p>
                  )}
                </div>
              </div>
              <div className="automation-card-actions">
                <div
                  className={`switch small ${automation.enabled ? 'active' : ''}`}
                  onClick={() => onToggle(automation.id, !automation.enabled)}
                  title={automation.enabled ? '禁用' : '启用'}
                >
                  <div className="switch-knob"></div>
                </div>
                <button className="btn-icon" onClick={() => onEdit(automation)} title="编辑">
                  ✏️
                </button>
                {!automation.isPreset && (
                  <button className="btn-icon delete" onClick={() => onDelete(automation.id)} title="删除">
                    🗑️
                  </button>
                )}
              </div>
            </div>
            
            <div className="automation-trigger">
              <span className="automation-label">IF</span>
              <span className="automation-condition">{getTriggerDescription(automation.trigger)}</span>
            </div>
            
            <div className="automation-actions-preview">
              <span className="automation-label">THEN</span>
              <div className="automation-actions-tags">
                {automation.actions.slice(0, 4).map(({ deviceId, state }) => {
                  const device = devices.find(d => d.id === deviceId);
                  if (!device) return null;
                  return (
                    <span
                      key={deviceId}
                      className={`automation-action-tag ${state.on ? 'on' : 'off'}`}
                      title={`${device.name}: ${state.on ? '开启' : '关闭'}`}
                    >
                      {typeIcons[device.type] || '📱'} {device.name}
                    </span>
                  );
                })}
                {automation.actions.length > 4 && (
                  <span className="automation-action-tag more">
                    +{automation.actions.length - 4}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AutomationManager({ automations, devices, activeSceneId, scenes, onCreateAutomation, onUpdateAutomation, onDeleteAutomation, onToggleAutomation, onClose }) {
  const [mode, setMode] = useState('list');
  const [editingAutomation, setEditingAutomation] = useState(null);

  const handleCreate = (data) => {
    onCreateAutomation(data);
    setMode('list');
  };

  const handleUpdate = (data) => {
    onUpdateAutomation(editingAutomation.id, data);
    setMode('list');
    setEditingAutomation(null);
  };

  const handleEdit = (automation) => {
    setEditingAutomation(automation);
    setMode('form');
  };

  const handleCancel = () => {
    setMode('list');
    setEditingAutomation(null);
  };

  return (
    <div className="automation-manager">
      <div className="modal-header">
        <h3>⚙️ 自动化规则管理</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="modal-body">
        {mode === 'list' && (
          <>
            <AutomationList
              automations={automations}
              devices={devices}
              activeSceneId={activeSceneId}
              scenes={scenes}
              onEdit={handleEdit}
              onDelete={handleDeleteAutomation}
              onToggle={onToggleAutomation}
            />
            <button
              className="btn btn-primary add-schedule-btn"
              onClick={() => setMode('form')}
            >
              ➕ 创建新规则
            </button>
          </>
        )}

        {mode === 'form' && (
          <AutomationForm
            automation={editingAutomation}
            devices={devices}
            onSubmit={editingAutomation ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEdit={!!editingAutomation}
          />
        )}
      </div>
    </div>
  );
}

export default AutomationManager;
