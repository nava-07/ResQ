import api from './axios';

// Auth & Users
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const getAllUsers = (params) => api.get('/auth/users', { params });
export const updateUserRole = (id, data) => api.put(`/auth/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);

// Disasters
export const createDisaster = (data) => api.post('/disasters', data);
export const getDisasters = (params) => api.get('/disasters', { params });
export const getDisasterById = (id) => api.get(`/disasters/${id}`);
export const updateDisaster = (id, data) => api.put(`/disasters/${id}`, data);
export const getDisasterStats = () => api.get('/disasters/stats');

// SOS
export const createSOS = (data) => api.post('/sos', data);
export const getAllSOS = (params) => api.get('/sos', { params });
export const getMySOS = () => api.get('/sos/my');
export const getSOSById = (id) => api.get(`/sos/${id}`);
export const updateSOSStatus = (id, data) => api.put(`/sos/${id}/status`, data);

// Volunteers
export const registerVolunteer = (data) => api.post('/volunteers/register', data);
export const getVolunteers = () => api.get('/volunteers');
export const getMyVolunteerProfile = () => api.get('/volunteers/me');
export const acceptMission = (sosId) => api.put(`/volunteers/accept/${sosId}`);
export const completeMission = (sosId) => api.put(`/volunteers/complete/${sosId}`);

// Resources
export const createResource = (data) => api.post('/resources', data);
export const getResources = (params) => api.get('/resources', { params });
export const updateResource = (id, data) => api.put(`/resources/${id}`, data);
export const deleteResource = (id) => api.delete(`/resources/${id}`);
export const getResourceStats = () => api.get('/resources/stats');

// Alerts
export const createAlert = (data) => api.post('/alerts', data);
export const getAlerts = () => api.get('/alerts');
export const updateAlert = (id, data) => api.put(`/alerts/${id}`, data);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);

// AI
export const analyzeSeverity = (data) => api.post('/ai/analyze', data);
export const detectFake = (data) => api.post('/ai/detect-fake', data);
