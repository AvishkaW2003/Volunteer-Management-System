import axios from 'axios';

const API_URL = 'http://localhost:5000/api/attendance';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAttendanceStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const getMyAttendance = async () => {
  const response = await axios.get(`${API_URL}/my-attendance`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
