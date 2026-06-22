import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Admin Reports
export const getAdminOverview = async () => {
  const response = await axios.get(`${API_URL}/admin/reports/overview`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getUserGrowth = async () => {
  const response = await axios.get(`${API_URL}/admin/reports/user-growth`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getEventsReport = async () => {
  const response = await axios.get(`${API_URL}/admin/reports/events`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
