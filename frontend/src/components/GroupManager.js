import React, { useState } from 'react';

const presetIcons = ['📦', '💡', '❄️', '📺', '🔊', '📷', '🏠', '🌙', '☀️', '🎮', '🔌', '🔥'];
const presetColors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#fbbf24', '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899'];

const typeIcons = {
  light: '💡',
  lamp: '🪔',
  ac: '❄️',
  tv: '📺',
  speaker: '🔊',
  camera: '📷'
};

function GroupForm({ group, devices, onSubmit, onCancel, isEdit }) {
  const [name, setName] = useState(group?.name || '');
  const [icon, setIcon] = useState(group?.icon || '📦');
  const [color, setColor] = useState(group?.color || '#667eea');
  const [selectedDevices, setSelectedDevices] = useState(group?.deviceIds || []);

  const toggleDevice = (deviceId) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const selectAll = () => {
    setSelectedDevices(devices.map(d => d.id));
  };

  const clearAll = () => {
    setSelectedDevices([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), icon, color, deviceIds: selectedDevices });
  };

  return (
    <form className="group-form" onSubmit={handleSubmit}>
      <div className="control-section">
        <h4>{isEdit ? '编辑分组' : '创建分组'}</h4>
        
        <div className="form-group">
          <label>分组名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：客厅灯组"
            className="form-input"
            autoFocus
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
            <label>选择设备 ({selectedDevices.length}个)</label>
            <div className="btn-group">
              <button type="button" className="btn btn-secondary btn-small" onClick={selectAll}>全选</button>
              <button type="button" className="btn btn-secondary btn-small" onClick={clearAll}>清空</button>
            </div>
          </div>
          <div className="device-select-list">
            {devices.length === 0 ? (
              <p className="empty-hint">暂无可用设备</p>
            ) : (
              devices.map((device) => (
                <div
                  key={device.id}
                  className={`device-select-item ${selectedDevices.includes(device.id) ? 'selected' : ''}`}
                  onClick={() => toggleDevice(device.id)}
                >
                  <span className="device-icon">{typeIcons[device.type] || '📱'}</span>
                  <span className="device-name">{device.name}</span>
                  <span className="device-check">{selectedDevices.includes(device.id) ? '✓' : ''}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            取消
          </button>
          <button type="submit" className="btn btn-primary" disabled={!name.trim() || selectedDevices.length === 0}>
            {isEdit ? '保存修改' : '创建分组'}
          </button>
        </div>
      </div>
    </form>
  );
}

function GroupList({ groups, devices, onEdit, onDelete, onSelect }) {
  if (groups.length === 0) {
    return (
      <div className="empty-schedules">
        <p>暂无设备分组</p>
        <p className="hint">点击下方按钮创建新分组</p>
      </div>
    );
  }

  const getGroupDeviceCount = (group) => {
    return devices.filter(d => group.deviceIds.includes(d.id)).length;
  };

  const getGroupPower = (group) => {
    return devices
      .filter(d => group.deviceIds.includes(d.id) && d.state?.on)
      .reduce((sum, d) => sum + (d.ratedPower || 0), 0);
  };

  return (
    <div className="group-list">
      {groups.map((group) => (
        <div key={group.id} className="group-card" style={{ borderLeftColor: group.color }}>
          <div className="group-card-header">
            <div className="group-card-title">
              <span className="group-icon" style={{ backgroundColor: group.color + '20', color: group.color }}>
                {group.icon}
              </span>
              <div>
                <h4>{group.name}</h4>
                <p className="group-meta">
                  {getGroupDeviceCount(group)} 个设备 · {getGroupPower(group)}W
                </p>
              </div>
            </div>
            <div className="group-card-actions">
              <button className="btn-icon" onClick={() => onSelect(group)} title="选择">
                👁️
              </button>
              <button className="btn-icon" onClick={() => onEdit(group)} title="编辑">
                ✏️
              </button>
              <button className="btn-icon delete" onClick={() => onDelete(group.id)} title="删除">
                🗑️
              </button>
            </div>
          </div>
          <div className="group-device-preview">
            {devices
              .filter(d => group.deviceIds.includes(d.id))
              .slice(0, 5)
              .map((device) => (
                <span key={device.id} className="group-device-tag" title={device.name}>
                  {typeIcons[device.type] || '📱'} {device.name}
                </span>
              ))}
            {getGroupDeviceCount(group) > 5 && (
              <span className="group-device-tag more">
                +{getGroupDeviceCount(group) - 5}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function GroupManager({ groups, devices, onCreateGroup, onUpdateGroup, onDeleteGroup, onClose }) {
  const [mode, setMode] = useState('list');
  const [editingGroup, setEditingGroup] = useState(null);

  const handleCreate = (data) => {
    onCreateGroup(data);
    setMode('list');
  };

  const handleUpdate = (data) => {
    onUpdateGroup(editingGroup.id, data);
    setMode('list');
    setEditingGroup(null);
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setMode('form');
  };

  const handleCancel = () => {
    setMode('list');
    setEditingGroup(null);
  };

  return (
    <div className="group-manager">
      <div className="modal-header">
        <h3>👥 设备分组管理</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="modal-body">
        {mode === 'list' && (
          <>
            <GroupList
              groups={groups}
              devices={devices}
              onEdit={handleEdit}
              onDelete={onDeleteGroup}
              onSelect={(group) => {
                onClose();
              }}
            />
            <button
              className="btn btn-primary add-schedule-btn"
              onClick={() => setMode('form')}
            >
              ➕ 创建新分组
            </button>
          </>
        )}

        {mode === 'form' && (
          <GroupForm
            group={editingGroup}
            devices={devices}
            onSubmit={editingGroup ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEdit={!!editingGroup}
          />
        )}
      </div>
    </div>
  );
}

export default GroupManager;
