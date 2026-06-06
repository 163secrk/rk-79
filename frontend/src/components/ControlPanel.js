import React, { useState } from 'react';

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

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

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

function getStatePreview(targetState) {
  const parts = [];
  if (targetState.on !== undefined) {
    parts.push(targetState.on ? '开启' : '关闭');
  }
  if (targetState.brightness !== undefined) {
    parts.push(`亮度${targetState.brightness}%`);
  }
  if (targetState.temperature !== undefined) {
    parts.push(`${targetState.temperature}°C`);
  }
  if (targetState.volume !== undefined) {
    parts.push(`音量${targetState.volume}`);
  }
  if (targetState.mode !== undefined) {
    const modeNames = { cool: '制冷', heat: '制热', auto: '自动', dry: '除湿' };
    parts.push(modeNames[targetState.mode] || targetState.mode);
  }
  return parts.join(' · ');
}

function formatDays(days) {
  if (days.length === 7) return '每天';
  if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return '工作日';
  if (days.length === 2 && days.includes(0) && days.includes(6)) return '周末';
  return days.map(d => weekDays[d]).join('、');
}

function ScheduleForm({ device, onSubmit, onCancel, editSchedule }) {
  const [name, setName] = useState(editSchedule?.name || '定时任务');
  const [time, setTime] = useState(editSchedule?.time || '07:00');
  const [days, setDays] = useState(editSchedule?.days || [0, 1, 2, 3, 4, 5, 6]);
  const [targetOn, setTargetOn] = useState(editSchedule?.targetState?.on !== undefined ? editSchedule.targetState.on : true);
  const [brightness, setBrightness] = useState(editSchedule?.targetState?.brightness || 80);
  const [temperature, setTemperature] = useState(editSchedule?.targetState?.temperature || 24);

  const toggleDay = (day) => {
    setDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetState = { on: targetOn };
    if (device.type === 'light' || device.type === 'lamp') {
      if (targetOn) targetState.brightness = brightness;
    }
    if (device.type === 'ac') {
      if (targetOn) targetState.temperature = temperature;
    }
    onSubmit({
      name,
      time,
      days,
      targetState,
      enabled: true
    });
  };

  const showBrightness = (device.type === 'light' || device.type === 'lamp') && targetOn;
  const showTemperature = device.type === 'ac' && targetOn;

  return (
    <form className="schedule-form" onSubmit={handleSubmit}>
      <div className="control-section">
        <h4>{editSchedule ? '编辑定时任务' : '添加定时任务'}</h4>
        
        <div className="form-group">
          <label>任务名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：早上开灯"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>执行时间</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>重复</label>
          <div className="day-selector">
            {weekDays.map((day, index) => (
              <button
                key={index}
                type="button"
                className={`day-btn ${days.includes(index) ? 'active' : ''}`}
                onClick={() => toggleDay(index)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>目标状态</label>
          <div className="target-state-controls">
            <Switch 
              label="电源" 
              checked={targetOn} 
              onChange={() => setTargetOn(!targetOn)} 
            />
          </div>
        </div>

        {showBrightness && (
          <Slider 
            label="目标亮度" 
            value={brightness} 
            onChange={setBrightness} 
          />
        )}

        {showTemperature && (
          <Slider 
            label="目标温度" 
            value={temperature} 
            onChange={setTemperature}
            min={16} 
            max={30} 
            unit="°C" 
          />
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            取消
          </button>
          <button type="submit" className="btn btn-primary" disabled={days.length === 0}>
            {editSchedule ? '保存修改' : '添加任务'}
          </button>
        </div>
      </div>
    </form>
  );
}

function ScheduleList({ schedules, onToggle, onEdit, onDelete }) {
  if (schedules.length === 0) {
    return (
      <div className="empty-schedules">
        <p>暂无定时任务</p>
        <p className="hint">点击下方按钮添加定时任务</p>
      </div>
    );
  }

  return (
    <div className="schedule-list">
      {schedules.map(schedule => (
        <div key={schedule.id} className={`schedule-item ${schedule.enabled ? '' : 'disabled'}`}>
          <div className="schedule-header">
            <span className="schedule-name">{schedule.name}</span>
            <div 
              className={`switch small ${schedule.enabled ? 'active' : ''}`}
              onClick={() => onToggle(schedule.id, !schedule.enabled)}
            >
              <div className="switch-knob" />
            </div>
          </div>
          <div className="schedule-details">
            <div className="schedule-time">
              <span className="time-icon">🕐</span>
              <span>{schedule.time}</span>
              <span className="schedule-days">{formatDays(schedule.days)}</span>
            </div>
            <div className="schedule-target">
              <span className="target-icon">🎯</span>
              <span>{getStatePreview(schedule.targetState)}</span>
            </div>
          </div>
          <div className="schedule-actions">
            <button 
              className="btn-icon" 
              onClick={() => onEdit(schedule)}
              title="编辑"
            >
              ✏️
            </button>
            <button 
              className="btn-icon delete" 
              onClick={() => onDelete(schedule.id)}
              title="删除"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ControlPanel({ 
  device, 
  onStateChange, 
  onDelete, 
  onClose,
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule
}) {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [activeTab, setActiveTab] = useState('control');

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

  const handleAddSchedule = async (scheduleData) => {
    await onAddSchedule({ ...scheduleData, deviceId: device.id });
    setShowScheduleForm(false);
  };

  const handleUpdateSchedule = async (scheduleData) => {
    await onUpdateSchedule(editingSchedule.id, scheduleData);
    setEditingSchedule(null);
    setShowScheduleForm(false);
  };

  const handleToggleSchedule = (id, enabled) => {
    onUpdateSchedule(id, { enabled });
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setShowScheduleForm(true);
  };

  const handleCancelForm = () => {
    setShowScheduleForm(false);
    setEditingSchedule(null);
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

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'control' ? 'active' : ''}`}
          onClick={() => setActiveTab('control')}
        >
          ⚙️ 控制
        </button>
        <button 
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          ⏰ 定时 {schedules.length > 0 && <span className="badge">{schedules.length}</span>}
        </button>
      </div>

      {activeTab === 'control' && (
        <div className="control-section">
          <h4>设备控制</h4>
          {renderControls(device.type, device.state, handleStateChange)}
        </div>
      )}

      {activeTab === 'schedule' && (
        <>
          {showScheduleForm ? (
            <ScheduleForm 
              device={device}
              onSubmit={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
              onCancel={handleCancelForm}
              editSchedule={editingSchedule}
            />
          ) : (
            <>
              <div className="control-section">
                <h4>定时任务</h4>
                <ScheduleList 
                  schedules={schedules}
                  onToggle={handleToggleSchedule}
                  onEdit={handleEditSchedule}
                  onDelete={onDeleteSchedule}
                />
              </div>
              <button 
                className="btn btn-primary add-schedule-btn"
                onClick={() => setShowScheduleForm(true)}
              >
                ➕ 添加定时任务
              </button>
            </>
          )}
        </>
      )}

      {activeTab === 'control' && (
        <button 
          className="btn btn-danger delete-btn" 
          onClick={() => onDelete(device.id)}
        >
          🗑️ 删除设备
        </button>
      )}
    </div>
  );
}

export default ControlPanel;
