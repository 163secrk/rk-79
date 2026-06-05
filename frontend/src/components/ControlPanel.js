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

function LightControls({ state, onStateChange }) {
  return (
    <>
      <Switch 
        label="电源" 
        checked={state.on} 
        onChange={() => onStateChange({ on: !state.on })} 
      />
      {state.on && (
        <>
          <Slider 
            label="亮度" 
            value={state.brightness} 
            onChange={(v) => onStateChange({ brightness: v })} 
          />
          <ColorPicker 
            label="颜色" 
            value={state.color} 
            onChange={(v) => onStateChange({ color: v })} 
          />
        </>
      )}
    </>
  );
}

function ACControls({ state, onStateChange }) {
  return (
    <>
      <Switch 
        label="电源" 
        checked={state.on} 
        onChange={() => onStateChange({ on: !state.on })} 
      />
      {state.on && (
        <>
          <Slider 
            label="温度" 
            value={state.temperature} 
            onChange={(v) => onStateChange({ temperature: v })} 
            min={16} 
            max={30} 
            unit="°C" 
          />
          <ModeSelector
            label="模式"
            value={state.mode}
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
    </>
  );
}

function TVControls({ state, onStateChange }) {
  return (
    <>
      <Switch 
        label="电源" 
        checked={state.on} 
        onChange={() => onStateChange({ on: !state.on })} 
      />
      {state.on && (
        <>
          <Slider 
            label="音量" 
            value={state.volume} 
            onChange={(v) => onStateChange({ volume: v })} 
          />
          <Slider 
            label="频道" 
            value={state.channel} 
            onChange={(v) => onStateChange({ channel: v })} 
            min={1} 
            max={999} 
            unit="" 
          />
        </>
      )}
    </>
  );
}

function SpeakerControls({ state, onStateChange }) {
  return (
    <>
      <Switch 
        label="电源" 
        checked={state.on} 
        onChange={() => onStateChange({ on: !state.on })} 
      />
      {state.on && (
        <Slider 
          label="音量" 
          value={state.volume} 
          onChange={(v) => onStateChange({ volume: v })} 
        />
      )}
    </>
  );
}

function CameraControls({ state, onStateChange }) {
  return (
    <>
      <Switch 
        label="电源" 
        checked={state.on} 
        onChange={() => onStateChange({ on: !state.on })} 
      />
      {state.on && (
        <Switch 
          label="录像" 
          checked={state.recording} 
          onChange={() => onStateChange({ recording: !state.recording })} 
        />
      )}
    </>
  );
}

function renderControls(type, state, onStateChange) {
  switch (type) {
    case 'light':
    case 'lamp':
      return <LightControls state={state} onStateChange={onStateChange} />;
    case 'ac':
      return <ACControls state={state} onStateChange={onStateChange} />;
    case 'tv':
      return <TVControls state={state} onStateChange={onStateChange} />;
    case 'speaker':
      return <SpeakerControls state={state} onStateChange={onStateChange} />;
    case 'camera':
      return <CameraControls state={state} onStateChange={onStateChange} />;
    default:
      return <Switch label="电源" checked={state.on} onChange={() => onStateChange({ on: !state.on })} />;
  }
}

function ControlPanel({ device, onStateChange, onDelete, onClose }) {
  if (!device) {
    return (
      <div className="control-panel">
        <div className="empty-panel">
          <div className="icon">👆</div>
          <p>点击场景中的设备</p>
          <p>或从左侧添加新设备</p>
        </div>
      </div>
    );
  }

  const handleStateChange = (newState) => {
    onStateChange(device.id, newState);
  };

  return (
    <div className="control-panel">
      <h3>
        <span>
          {typeIcons[device.type] || '📱'} {device.name}
        </span>
        <button className="close-btn" onClick={onClose}>✕</button>
      </h3>

      <div className="device-info">
        <p>
          <span>类型</span>
          <span>{typeNames[device.type] || device.type}</span>
        </p>
        <p>
          <span>ID</span>
          <span style={{ fontSize: '0.7rem' }}>{device.id}</span>
        </p>
        <p>
          <span>位置</span>
          <span>
            {device.position.x.toFixed(1)}, {device.position.y.toFixed(1)}, {device.position.z.toFixed(1)}
          </span>
        </p>
      </div>

      <div className="control-section">
        <h4>设备控制</h4>
        {renderControls(device.type, device.state, handleStateChange)}
      </div>

      <button 
        className="btn btn-danger delete-btn" 
        onClick={() => onDelete(device.id)}
      >
        🗑️ 删除设备
      </button>
    </div>
  );
}

export default ControlPanel;
