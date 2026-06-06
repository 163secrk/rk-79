export const DEVICE_POWER_CONFIG = {
  light: {
    basePower: 30,
    minPower: 5,
    maxPower: 60,
    standbyPower: 0.5,
    brightnessFactor: 0.8
  },
  lamp: {
    basePower: 15,
    minPower: 3,
    maxPower: 25,
    standbyPower: 0.3,
    brightnessFactor: 0.9
  },
  ac: {
    basePower: 1200,
    minPower: 100,
    maxPower: 2500,
    standbyPower: 5,
    tempFactor: 50,
    modeMultiplier: {
      cool: 1.2,
      heat: 1.5,
      auto: 1.0,
      dry: 0.7
    }
  },
  tv: {
    basePower: 100,
    minPower: 30,
    maxPower: 180,
    standbyPower: 3,
    volumeFactor: 0.3
  },
  speaker: {
    basePower: 50,
    minPower: 10,
    maxPower: 80,
    standbyPower: 1,
    volumeFactor: 0.6
  },
  camera: {
    basePower: 10,
    minPower: 5,
    maxPower: 15,
    standbyPower: 0,
    recordingBonus: 5
  }
};

export const getDevicePower = (device) => {
  const config = DEVICE_POWER_CONFIG[device.type];
  if (!config) return 0;

  const { state } = device;
  if (!state.on) {
    return config.standbyPower || 0;
  }

  let power = config.basePower;

  switch (device.type) {
    case 'light':
    case 'lamp': {
      const brightness = state.brightness || 80;
      const brightnessMultiplier = config.minPower + 
        (config.maxPower - config.minPower) * (brightness / 100) * config.brightnessFactor;
      power = brightnessMultiplier;
      break;
    }
    case 'ac': {
      const mode = state.mode || 'cool';
      const temp = state.temperature || 24;
      const tempDiff = Math.abs(26 - temp);
      const modeMult = config.modeMultiplier[mode] || 1;
      power = (config.basePower + tempDiff * config.tempFactor) * modeMult;
      power = Math.min(config.maxPower, Math.max(config.minPower, power));
      break;
    }
    case 'tv': {
      const volume = state.volume || 50;
      const volumeBonus = config.volumeFactor * (volume / 100) * config.basePower;
      power = config.basePower + volumeBonus;
      power = Math.min(config.maxPower, Math.max(config.minPower, power));
      break;
    }
    case 'speaker': {
      const volume = state.volume || 60;
      const volumeMult = 0.3 + config.volumeFactor * (volume / 100);
      power = config.basePower * volumeMult;
      power = Math.min(config.maxPower, Math.max(config.minPower, power));
      break;
    }
    case 'camera': {
      if (state.recording) {
        power = config.basePower + config.recordingBonus;
      }
      break;
    }
    default:
      break;
  }

  return Math.round(power * 10) / 10;
};

export const calculateTotalPower = (devices) => {
  return devices.reduce((total, device) => total + getDevicePower(device), 0);
};

export const getDevicesPowerBreakdown = (devices) => {
  return devices.map(device => ({
    id: device.id,
    name: device.name,
    type: device.type,
    power: getDevicePower(device),
    isOn: device.state.on
  })).sort((a, b) => b.power - a.power);
};

export const formatPower = (watts) => {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }
  return `${watts.toFixed(1)} W`;
};

export const calculateDailyCost = (watts, ratePerKwh = 0.6) => {
  const kwhPerDay = (watts / 1000) * 24;
  return kwhPerDay * ratePerKwh;
};

export const formatCost = (cost) => {
  return `¥${cost.toFixed(2)}`;
};

export const getPowerLevel = (watts) => {
  if (watts < 500) return { level: 'low', color: '#4caf50', label: '低能耗' };
  if (watts < 2000) return { level: 'medium', color: '#ff9800', label: '中能耗' };
  if (watts < 4000) return { level: 'high', color: '#f44336', label: '高能耗' };
  return { level: 'critical', color: '#e91e63', label: '超高能耗' };
};

export const getDeviceTypeName = (type) => {
  const names = {
    light: '吸顶灯',
    lamp: '台灯',
    ac: '空调',
    tv: '电视',
    speaker: '音箱',
    camera: '摄像头'
  };
  return names[type] || type;
};

export const getDeviceTypeIcon = (type) => {
  const icons = {
    light: '💡',
    lamp: '🪔',
    ac: '❄️',
    tv: '📺',
    speaker: '🔊',
    camera: '📷'
  };
  return icons[type] || '📱';
};
