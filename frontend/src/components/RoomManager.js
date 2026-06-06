import React, { useState } from 'react';
import { roomIcons, roomTypeNames } from './RoomTabs';

const roomTypes = Object.entries(roomTypeNames).map(([value, label]) => ({
  value,
  label,
  icon: roomIcons[value]
}));

const availableIcons = ['🛋️', '🛏️', '🍳', '🚿', '📚', '🍽️', '💼', '🏠', '🎮', '🎵', '🌸', '🌿'];

const availableColors = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c',
  '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
  '#fa709a', '#fee140', '#ff9a9e', '#a18cd1',
  '#fbc2eb', '#a6c1ee', '#84fab0', '#8fd3f4'
];

function RoomForm({ onSubmit, onCancel, editRoom, devices }) {
  const [name, setName] = useState(editRoom?.name || '');
  const [roomType, setRoomType] = useState(editRoom?.roomType || 'living');
  const [icon, setIcon] = useState(editRoom?.icon || roomIcons[roomType] || '🏠');
  const [color, setColor] = useState(editRoom?.color || '#667eea');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: name || roomTypeNames[roomType],
      roomType,
      icon,
      color
    });
  };

  const getRoomDeviceCount = (roomId) => {
    return devices.filter(d => d.roomId === roomId).length;
  };

  return (
    <form className="room-form" onSubmit={handleSubmit}>
      <div className="modal-header">
        <h3>{editRoom ? '编辑房间' : '创建房间'}</h3>
        <button type="button" className="close-btn" onClick={onCancel}>✕</button>
      </div>

      <div className="modal-body">
        <div className="form-group">
          <label>房间类型</label>
          <div className="room-type-picker">
            {roomTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`room-type-btn ${roomType === type.value ? 'active' : ''}`}
                onClick={() => {
                  setRoomType(type.value);
                  if (!editRoom) {
                    setIcon(type.icon);
                    setName(type.label);
                  }
                }}
              >
                <span className="room-type-icon">{type.icon}</span>
                <span className="room-type-label">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>房间名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={roomTypeNames[roomType]}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>房间图标</label>
          <div className="icon-picker">
            {availableIcons.map((i) => (
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
          <label>主题颜色</label>
          <div className="color-picker-grid">
            {availableColors.map((c) => (
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

        {editRoom && (
          <div className="form-group">
            <label>房间信息</label>
            <div className="room-info-card">
              <p>设备数量: {getRoomDeviceCount(editRoom.id)} 个</p>
              <p>创建时间: {new Date(editRoom.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="btn btn-primary" disabled={!name && !roomType}>
          {editRoom ? '保存修改' : '创建房间'}
        </button>
      </div>
    </form>
  );
}

function RoomManager({ rooms, devices, onCreateRoom, onUpdateRoom, onDeleteRoom, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const handleCreateRoom = (roomData) => {
    onCreateRoom(roomData);
    setShowForm(false);
  };

  const handleUpdateRoom = (roomData) => {
    onUpdateRoom(editingRoom.id, roomData);
    setEditingRoom(null);
    setShowForm(false);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  const getRoomDeviceCount = (roomId) => {
    return devices.filter(d => d.roomId === roomId).length;
  };

  if (showForm) {
    return (
      <div className="room-manager">
        <RoomForm
          onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom}
          onCancel={handleCancelForm}
          editRoom={editingRoom}
          devices={devices}
        />
      </div>
    );
  }

  return (
    <div className="room-manager">
      <div className="modal-header">
        <h3>🏠 房间管理</h3>
        <button type="button" className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="modal-body">
        {rooms.length === 0 ? (
          <div className="empty-hint">
            <p>暂无房间</p>
            <p className="hint">点击下方按钮创建第一个房间</p>
          </div>
        ) : (
          <div className="room-list">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="room-card"
                style={{ borderLeftColor: room.color }}
              >
                <div className="room-card-header">
                  <div className="room-card-title">
                    <div
                      className="room-icon"
                      style={{ backgroundColor: room.color + '20', color: room.color }}
                    >
                      {room.icon}
                    </div>
                    <div>
                      <h4>{room.name}</h4>
                      <p className="room-meta">
                        {roomTypeNames[room.roomType] || '其他'} · {getRoomDeviceCount(room.id)} 个设备
                      </p>
                    </div>
                  </div>
                  <div className="room-card-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEditRoom(room)}
                      title="编辑"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => {
                        if (window.confirm(`确定要删除房间"${room.name}"吗？房间内的设备也将被删除。`)) {
                          onDeleteRoom(room.id);
                        }
                      }}
                      title="删除"
                      disabled={rooms.length <= 1}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {getRoomDeviceCount(room.id) > 0 && (
                  <div className="room-device-preview">
                    {devices
                      .filter(d => d.roomId === room.id)
                      .slice(0, 5)
                      .map((device) => (
                        <span key={device.id} className="group-device-tag">
                          {device.name}
                        </span>
                      ))}
                    {getRoomDeviceCount(room.id) > 5 && (
                      <span className="group-device-tag more">
                        +{getRoomDeviceCount(room.id) - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          className="btn btn-primary add-room-btn-full"
          onClick={() => setShowForm(true)}
        >
          ➕ 创建新房间
        </button>
      </div>
    </div>
  );
}

export default RoomManager;
