import React from 'react';

const deviceTypes = [
  { type: 'light', name: '吸顶灯', icon: '💡' },
  { type: 'lamp', name: '台灯', icon: '🪔' },
  { type: 'ac', name: '空调', icon: '❄️' },
  { type: 'tv', name: '电视', icon: '📺' },
  { type: 'speaker', name: '音箱', icon: '🔊' },
  { type: 'camera', name: '摄像头', icon: '📷' },
];

function DeviceLibrary({ onAddDevice }) {
  return (
    <div className="device-library">
      <h3>设备库</h3>
      {deviceTypes.map((item) => (
        <div
          key={item.type}
          className="device-item"
          onClick={() => onAddDevice(item.type)}
        >
          <span className="device-icon">{item.icon}</span>
          <span className="device-name">{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export default DeviceLibrary;
