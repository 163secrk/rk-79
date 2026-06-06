import React from 'react';

const typeNames = {
  light: '吸顶灯',
  lamp: '台灯',
  ac: '空调',
  tv: '电视',
  speaker: '音箱',
  camera: '摄像头'
};

const typeIcons = {
  light: '💡',
  lamp: '🪔',
  ac: '❄️',
  tv: '📺',
  speaker: '🔊',
  camera: '📷'
};

function Switch({ checked, onChange, label }) {
  return (
    <div className="control-row">
      <label>{label}</label>
      <div 
        className={`switch ${checked ? 'active' : ''}`}
        onClick={onChange}
      >
        <div className="switch-knob" />
      </div>
    </div>
  );
}

function Slider({ value, onChange, label, min = 0, max = 100, unit = '%' }) {
  return (
    <div className="control-section">
      <div className="control-row">
        <label>{label}</label>
        <span>{value}{unit}</span>
      </div>
      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

function ColorPicker({ value, onChange, label }) {
  return (
    <div className="control-section">
      <div className="control-row">
        <label>{label}</label>
        <span style={{ color: value }}>{value}</span>
      </div>
      <input
        type="color"
        className="color-picker"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ModeSelector({ value, onChange, label, options }) {
  return (
    <div className="control-section">
      <h4>{label}</h4>
      <div className="mode-selector">
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`mode-btn ${value === opt.value ? 'active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function GroupControls({ devices, onStateChange }) {
  if (devices.length === 0) return null;

  const allOn = devices.every(d => d.state?.on);
  const anyOn = devices.some(d => d.state?.on);
  const hasLights = devices.some(d => d.type === 'light' || d.type === 'lamp');
  const hasAC = devices.some(d => d.type === 'ac');
  const hasTV = devices.some(d => d.type === 'tv');
  const hasSpeaker = devices.some(d => d.type === 'speaker');

  const avgBrightness = hasLights
    ? Math.round(devices.filter(d => d.type === 'light' || d.type === 'lamp').reduce((sum, d) => sum + (d.state?.brightness || 0), 0) /
        devices.filter(d => d.type === 'light' || d.type === 'lamp').length)
    : 80;

  const avgTemperature = hasAC
    ? Math.round(devices.filter(d => d.type === 'ac').reduce((sum, d) => sum + (d.state?.temperature || 24), 0) /
        devices.filter(d => d.type === 'ac').length)
    : 24;

  const lightColor = hasLights
    ? devices.find(d => d.type === 'light' || d.type === 'lamp')?.state?.color || '#ffffff'
    : '#ffffff';

  const acMode = hasAC
    ? devices.find(d => d.type === 'ac')?.state?.mode || 'cool'
    : 'cool';

  const avgVolume = hasSpeaker
    ? Math.round(devices.filter(d => d.type === 'speaker' || d.type === 'tv').reduce((sum, d) => sum + (d.state?.volume || 50), 0) /
        devices.filter(d => d.type === 'speaker' || d.type === 'tv').length)
    : 50;

  return (
    <>
      <div className="batch-control-card">
        <div className="batch-control-header">
          <span>⚡ 一键控制</span>
          <span className="batch-device-count">{devices.length} 个设备</span>
        </div>
        <div className="batch-buttons">
          <button 
            className="btn btn-primary batch-btn"
            onClick={() => onStateChange({ on: true })}
          >
            🔛 全部开启
          </button>
          <button 
            className="btn btn-secondary batch-btn"
            onClick={() => onStateChange({ on: false })}
          >
            🔴 全部关闭
          </button>
        </div>
      </div>

      <Switch 
        label="电源" 
        checked={allOn} 
        onChange={() => onStateChange({ on: !anyOn })} 
      />
      
      {anyOn && (
        <>
          {hasLights && (
            <>
              <Slider 
                label="亮度" 
                value={avgBrightness} 
                onChange={(v) => onStateChange({ brightness: v })} 
              />
              <ColorPicker 
                label="颜色" 
                value={lightColor} 
                onChange={(v) => onStateChange({ color: v })} 
              />
            </>
          )}

          {hasAC && (
            <>
              <Slider 
                label="温度" 
                value={avgTemperature} 
                onChange={(v) => onStateChange({ temperature: v })}
                min={16} 
                max={30} 
                unit="°C" 
              />
              <ModeSelector
                label="模式"
                value={acMode}
                onChange={(v) => onStateChange({ mode: v })}
                options={[
                  { value: 'cool', label: '制冷', icon: '❄️' },
                  { value: 'heat', label: '制热', icon: '🔥' },
                  { value: 'auto', label: '自动', icon: '🔄' },
                  { value: 'dry', label: '除湿', icon: '💧' }
                ]}
              />
            </>
          )}

          {(hasSpeaker || hasTV) && (
            <Slider 
              label="音量" 
              value={avgVolume} 
              onChange={(v) => onStateChange({ volume: v })} 
            />
          )}
        </>
      )}
    </>
  );
}

function GroupPanel({ group, devices, onStateChange, onDelete, onClose, onEdit }) {
  const totalPower = devices
    .filter(d => d.state?.on)
    .reduce((sum, d) => sum + (d.ratedPower || 0), 0);

  const onCount = devices.filter(d => d.state?.on).length;

  return (
    <div className="control-panel group-panel">
      <h3>
        <span>
          <span className="group-panel-icon" style={{ backgroundColor: group.color + '20', color: group.color }}>
            {group.icon}
          </span>
          {group.name}
        </span>
        <button className="close-btn" onClick={onClose}>✕</button>
      </h3>

      <div className="group-info">
        <p>
          <span>设备数量</span>
          <span>{devices.length} 个</span>
        </p>
        <p>
          <span>运行状态</span>
          <span>{onCount} 个开启 / {devices.length - onCount} 个关闭</span>
        </p>
        <p>
          <span>总功率</span>
          <span style={{ color: totalPower > 0 ? '#4ade80' : '#9ca3af' }}>{totalPower}W</span>
        </p>
      </div>

      <div className="control-section">
        <h4>批量控制</h4>
        <GroupControls devices={devices} onStateChange={onStateChange} />
      </div>

      <div className="control-section">
        <h4>设备列表</h4>
        <div className="group-devices-list">
          {devices.map((device) => (
            <div key={device.id} className="group-device-item">
              <span className="device-icon">{typeIcons[device.type] || '📱'}</span>
              <div className="device-details">
                <span className="device-name">{device.name}</span>
                <span className="device-type">{typeNames[device.type] || device.type}</span>
              </div>
              <div className={`device-status ${device.state?.on ? 'on' : 'off'}`}>
                {device.state?.on ? '开启' : '关闭'}
              </div>
            </div>
          ))}
          {devices.length === 0 && (
            <p className="empty-hint">分组中暂无设备</p>
          )}
        </div>
      </div>

      <div className="group-actions">
        <button className="btn btn-secondary" onClick={onEdit}>
          ✏️ 编辑分组
        </button>
        <button className="btn btn-danger delete-btn" onClick={onDelete}>
          🗑️ 删除分组
        </button>
      </div>
    </div>
  );
}

export default GroupPanel;
