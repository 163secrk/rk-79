import React from 'react';

const roomIcons = {
  living: '🛋️',
  bedroom: '🛏️',
  kitchen: '🍳',
  bathroom: '🚿',
  study: '📚',
  dining: '🍽️',
  office: '💼',
  other: '🏠'
};

const roomTypeNames = {
  living: '客厅',
  bedroom: '卧室',
  kitchen: '厨房',
  bathroom: '浴室',
  study: '书房',
  dining: '餐厅',
  office: '办公室',
  other: '其他'
};

function RoomTabs({ rooms, currentRoomId, onRoomSelect, onManageRooms, devices }) {
  const getRoomDeviceCount = (roomId) => {
    return devices.filter(d => d.roomId === roomId).length;
  };

  const getRoomIcon = (room) => {
    return room.icon || roomIcons[room.roomType] || '🏠';
  };

  return (
    <div className="room-tabs-container">
      <div className="room-tabs">
        {rooms.map((room) => (
          <button
            key={room.id}
            className={`room-tab ${currentRoomId === room.id ? 'active' : ''}`}
            style={{
              borderBottomColor: currentRoomId === room.id ? room.color : 'transparent'
            }}
            onClick={() => onRoomSelect(room.id)}
          >
            <span className="room-tab-icon">{getRoomIcon(room)}</span>
            <span className="room-tab-name">{room.name}</span>
            {getRoomDeviceCount(room.id) > 0 && (
              <span className="room-tab-badge" style={{ backgroundColor: room.color }}>
                {getRoomDeviceCount(room.id)}
              </span>
            )}
          </button>
        ))}
        <button
          className="room-tab add-room-btn"
          onClick={onManageRooms}
          title="管理房间"
        >
          <span className="room-tab-icon">⚙️</span>
          <span className="room-tab-name">管理</span>
        </button>
      </div>
    </div>
  );
}

export { roomIcons, roomTypeNames };
export default RoomTabs;
