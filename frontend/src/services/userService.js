import axios from 'axios';

const API_URL = 'http://localhost:5000/api/volunteers';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch authenticated student's dashboard details (statistics, joined events, certificates, hours, reputation).
 */
export const getStudentDashboard = async () => {
  const response = await axios.get(`${API_URL}/student-dashboard`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Fetch student profile settings.
 */
export const getStudentSettings = async () => {
  const response = await axios.get(`${API_URL}/settings`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Save student profile settings.
 */
export const updateStudentSettings = async (data) => {
  const response = await axios.put(`${API_URL}/settings`, data, {
    headers: getAuthHeader(),
  });
  return response.data;
};