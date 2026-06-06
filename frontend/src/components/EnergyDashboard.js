import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  calculateTotalPower,
  getDevicesPowerBreakdown,
  formatPower,
  calculateDailyCost,
  formatCost,
  getPowerLevel,
  getDeviceTypeIcon,
  DEVICE_POWER_CONFIG
} from '../utils/energyUtils';

function GaugeMeter({ value, maxValue, color, label }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const rotation = (percentage / 100) * 180 - 90;

  const generateTicks = () => {
    const ticks = [];
    for (let i = 0; i <= 10; i++) {
      const angle = (i / 10) * 180 - 90;
      const isMajor = i % 2 === 0;
      ticks.push(
        <div
          key={i}
          className={`gauge-tick ${isMajor ? 'major' : 'minor'}`}
          style={{ transform: `rotate(${angle}deg)` }}
        />
      );
    }
    return ticks;
  };

  return (
    <div className="gauge-meter">
      <div className="gauge-container">
        <div className="gauge-background">
          {generateTicks()}
        </div>
        <div
          className="gauge-fill"
          style={{
            background: `conic-gradient(from -90deg, ${color} 0deg, ${color} ${percentage * 1.8}deg, rgba(255,255,255,0.1) ${percentage * 1.8}deg, rgba(255,255,255,0.1) 180deg)`,
          }}
        />
        <div className="gauge-center">
          <div className="gauge-needle" style={{ transform: `rotate(${rotation}deg)` }} />
          <div className="gauge-cap" />
        </div>
      </div>
      <div className="gauge-value" style={{ color }}>
        {formatPower(value)}
      </div>
      <div className="gauge-label">{label}</div>
    </div>
  );
}

function PowerBar({ device, totalPower }) {
  const percentage = totalPower > 0 ? (device.power / totalPower) * 100 : 0;
  const powerLevel = getPowerLevel(device.power);

  return (
    <div className="power-bar-item">
      <div className="power-bar-header">
        <div className="power-bar-info">
          <span className="power-bar-icon">{getDeviceTypeIcon(device.type)}</span>
          <span className="power-bar-name">{device.name}</span>
          <span className={`power-status ${device.isOn ? 'on' : 'off'}`}>
            {device.isOn ? '运行中' : '待机'}
          </span>
        </div>
        <div className="power-bar-value" style={{ color: device.isOn ? powerLevel.color : '#666' }}>
          {formatPower(device.power)}
        </div>
      </div>
      <div className="power-bar-track">
        <div
          className="power-bar-fill"
          style={{
            width: `${percentage}%`,
            background: device.isOn
              ? `linear-gradient(90deg, ${powerLevel.color}, ${powerLevel.color}88)`
              : 'rgba(255,255,255,0.2)',
          }}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, color }) {
  return (
    <div className="stat-card" style={{ borderColor: color + '44' }}>
      <div className="stat-icon" style={{ background: color + '22', color }}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ color }}>{value}</div>
        {subValue && <div className="stat-subvalue">{subValue}</div>}
      </div>
    </div>
  );
}

function EnergyDashboard({ devices }) {
  const [displayPower, setDisplayPower] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [electricityRate] = useState(0.6);
  const displayPowerRef = useRef(0);

  useEffect(() => {
    displayPowerRef.current = displayPower;
  }, [displayPower]);

  const totalPower = useMemo(() => calculateTotalPower(devices), [devices]);
  const powerBreakdown = useMemo(() => getDevicesPowerBreakdown(devices), [devices]);
  const powerLevel = useMemo(() => getPowerLevel(totalPower), [totalPower]);
  const activeDevices = useMemo(() => devices.filter(d => d.state.on).length, [devices]);
  const dailyCost = useMemo(() => calculateDailyCost(totalPower, electricityRate), [totalPower, electricityRate]);

  useEffect(() => {
    const targetPower = totalPower;
    const startPower = displayPowerRef.current;
    const diff = targetPower - startPower;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentPower = startPower + diff * easeProgress;

      const fluctuation = (Math.random() - 0.5) * currentPower * 0.02;
      const newPower = Math.max(0, currentPower + fluctuation);
      setDisplayPower(newPower);
      displayPowerRef.current = newPower;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [totalPower]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentPower = displayPowerRef.current;
      const fluctuation = (Math.random() - 0.5) * currentPower * 0.03;
      const newPower = Math.max(0, currentPower + fluctuation);
      setDisplayPower(newPower);
      displayPowerRef.current = newPower;

      setHistoryData(prev => {
        const newData = [...prev, newPower];
        if (newData.length > 30) {
          newData.shift();
        }
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const maxPower = useMemo(() => {
    const maxConfigPower = Object.values(DEVICE_POWER_CONFIG).reduce(
      (sum, config) => sum + config.maxPower,
      0
    );
    return Math.max(5000, maxConfigPower);
  }, []);

  const miniChart = useMemo(() => {
    if (historyData.length < 2) return null;
    const max = Math.max(...historyData, 1);
    const points = historyData.map((val, i) => {
      const x = (i / (historyData.length - 1)) * 100;
      const y = 100 - (val / max) * 80 - 10;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="mini-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={powerLevel.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon
          points={`0,100 ${points} 100,100`}
          fill={`url(#gradient-${powerLevel.level})`}
          opacity="0.3"
        />
        <defs>
          <linearGradient id={`gradient-${powerLevel.level}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={powerLevel.color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={powerLevel.color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  }, [historyData, powerLevel]);

  return (
    <div className="energy-dashboard">
      <div className="dashboard-header">
        <h3>⚡ 实时能耗监测</h3>
        <span className={`power-badge ${powerLevel.level}`} style={{ background: powerLevel.color + '33', color: powerLevel.color }}>
          {powerLevel.label}
        </span>
      </div>

      <div className="dashboard-main">
        <GaugeMeter
          value={displayPower}
          maxValue={maxPower}
          color={powerLevel.color}
          label="即时总功耗"
        />

        <div className="stats-grid">
          <StatCard
            icon="🔌"
            label="运行设备"
            value={`${activeDevices}/${devices.length}`}
            color="#2196f3"
          />
          <StatCard
            icon="💰"
            label="预估日电费"
            value={formatCost(dailyCost)}
            subValue={`${formatCost(dailyCost * 30)}/月`}
            color="#4caf50"
          />
          <StatCard
            icon="📊"
            label="峰值功率"
            value={formatPower(maxPower)}
            color="#ff9800"
          />
        </div>

        {miniChart && (
          <div className="mini-chart-container">
            <div className="mini-chart-label">
              <span>📈 最近30秒功耗趋势</span>
            </div>
            {miniChart}
          </div>
        )}
      </div>

      <div className="power-breakdown">
        <h4>设备功耗明细</h4>
        <div className="power-breakdown-list">
          {powerBreakdown.map((device) => (
            <PowerBar
              key={device.id}
              device={device}
              totalPower={totalPower}
            />
          ))}
        </div>
      </div>

      <div className="dashboard-tips">
        <p>💡 提示：空调制热模式比制冷耗电更多，灯光亮度越高功耗越大</p>
      </div>
    </div>
  );
}

export default EnergyDashboard;
