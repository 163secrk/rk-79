import React, { useState } from 'react';

const deviceTypes = [
  { type: 'light', name: '吸顶灯', icon: '💡' },
  { type: 'lamp', name: '台灯', icon: '🪔' },
  { type: 'ac', name: '空调', icon: '❄️' },
  { type: 'tv', name: '电视', icon: '📺' },
  { type: 'speaker', name: '音箱', icon: '🔊' },
  { type: 'camera', name: '摄像头', icon: '📷' },
];

function DeviceLibrary({ onAddDevice, groups, selectedGroup, onGroupSelect, onManageGroups }) {
  const [activeTab, setActiveTab] = useState('devices');

  const getGroupDeviceCount = (group, devices) => {
    return group.deviceIds?.length || 0;
  };

  return (
    <div className="device-library">
      <div className="library-tabs">
        <button
          className={`library-tab ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          📱 设备
        </button>
        <button
          className={`library-tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          👥 分组 {groups.length > 0 && <span className="badge">{groups.length}</span>}
        </button>
      </div>

      {activeTab === 'devices' && (
        <>
          <h3>添加设备</h3>
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
        </>
      )}

      {activeTab === 'groups' && (
        <>
          <div className="control-row">
            <h3>设备分组</h3>
            <button className="btn-icon" onClick={onManageGroups} title="管理分组">
              ⚙️
            </button>
          </div>
          {groups.length === 0 ? (
            <div className="empty-schedules">
              <p>暂无分组</p>
              <button className="btn btn-primary btn-small" onClick={onManageGroups}>
                创建分组
              </button>
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group.id}
                className={`group-item ${selectedGroup?.id === group.id ? 'selected' : ''}`}
                style={{ borderLeftColor: group.color }}
                onClick={() => onGroupSelect(group)}
              >
                <span className="device-icon" style={{ backgroundColor: group.color + '20', color: group.color }}>
                  {group.icon}
                </span>
                <div className="group-item-info">
                  <span className="device-name">{group.name}</span>
                  <span className="group-item-count">
                    {getGroupDeviceCount(group)} 个设备
                  </span>
                </div>
              </div>
            ))
          )}
          <button
            className="btn btn-secondary btn-small add-group-btn"
            onClick={onManageGroups}
          >
            ➕ 管理分组
          </button>
        </>
      )}
    </div>
  );
}

export default DeviceLibrary;
