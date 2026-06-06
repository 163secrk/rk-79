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

export const getSchedules = async () => {
  const response = await api.get('/schedules');
  return response.data;
};

export const createSchedule = async (schedule) => {
  const response = await api.post('/schedules', { schedule });
  return response.data;
};

export const updateSchedule = async (id, data) => {
  const response = await api.put(`/schedules/${id}`, data);
  return response.data;
};

export const deleteSchedule = async (id) => {
  const response = await api.delete(`/schedules/${id}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getGroups = async () => {
  const response = await api.get('/groups');
  return response.data;
};

export const createGroup = async (group) => {
  const response = await api.post('/groups', { group });
  return response.data;
};

export const updateGroup = async (id, data) => {
  const response = await api.put(`/groups/${id}`, data);
  return response.data;
};

export const deleteGroup = async (id) => {
  const response = await api.delete(`/groups/${id}`);
  return response.data;
};

export const updateGroupState = async (id, state) => {
  const response = await api.put(`/groups/${id}/state`, state);
  return response.data;
};

export const getRooms = async () => {
  const response = await api.get('/rooms');
  return response.data;
};

export const saveRooms = async (rooms) => {
  const response = await api.post('/rooms', { rooms });
  return response.data;
};

export const createRoom = async (room) => {
  const response = await api.post('/rooms', { room });
  return response.data;
};

export const updateRoom = async (id, data) => {
  const response = await api.put(`/rooms/${id}`, data);
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};

export const getScenes = async () => {
  const response = await api.get('/scenes');
  return response.data;
};

export const createScene = async (scene) => {
  const response = await api.post('/scenes', { scene });
  return response.data;
};

export const updateScene = async (id, data) => {
  const response = await api.put(`/scenes/${id}`, data);
  return response.data;
};

export const deleteScene = async (id) => {
  const response = await api.delete(`/scenes/${id}`);
  return response.data;
};

export const activateScene = async (id) => {
  const response = await api.post(`/scenes/${id}/activate`);
  return response.data;
};

export const deactivateScene = async () => {
  const response = await api.post('/scenes/deactivate');
  return response.data;
};

export const getSceneConflicts = async (id) => {
  const response = await api.get(`/scenes/${id}/conflicts`);
  return response.data;
};

export const getAutomationConflicts = async (id) => {
  const response = await api.get(`/automations/${id}/conflicts`);
  return response.data;
};

export const checkConflicts = async (type, id) => {
  const response = await api.get(`/conflicts/check?type=${type}&id=${id}`);
  return response.data;
};

export const getSystemState = async () => {
  const response = await api.get('/system-state');
  return response.data;
};

export const getAutomations = async () => {
  const response = await api.get('/automations');
  return response.data;
};

export const createAutomation = async (automation) => {
  const response = await api.post('/automations', { automation });
  return response.data;
};

export const updateAutomation = async (id, data) => {
  const response = await api.put(`/automations/${id}`, data);
  return response.data;
};

export const deleteAutomation = async (id) => {
  const response = await api.delete(`/automations/${id}`);
  return response.data;
};

export const toggleAutomation = async (id, enabled) => {
  const response = await api.put(`/automations/${id}/toggle`, { enabled });
  return response.data;
};

export default api;
