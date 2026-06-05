import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8079/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

export const getDevices = async () => {
  const response = await api.get('/devices');
  return response.data;
};

export const saveDevices = async (devices) => {
  const response = await api.post('/devices', { devices });
  return response.data;
};

export const updateDevice = async (id, data) => {
  const response = await api.put(`/devices/${id}`, data);
  return response.data;
};

export const updateDeviceState = async (id, state) => {
  const response = await api.put(`/devices/${id}/state`, state);
  return response.data;
};

export const addDevice = async (id, device) => {
  const response = await api.post(`/devices/${id}`, device);
  return response.data;
};

export const deleteDevice = async (id) => {
  const response = await api.delete(`/devices/${id}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
