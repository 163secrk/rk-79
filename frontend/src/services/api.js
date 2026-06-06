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

export default api;
