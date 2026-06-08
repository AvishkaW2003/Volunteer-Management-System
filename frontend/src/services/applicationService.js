import axios from 'axios';

const API_URL = 'http://localhost:5000/api/volunteers';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Organizer — all applications across their events
export const getApplicationsForOrganizer = async () => {
  const response = await axios.get(`${API_URL}/applications`, {
    headers: getAuthHeader(),
  });
  return response.data;
};