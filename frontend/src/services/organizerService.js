import axios from 'axios';

const API_URL = 'http://localhost:5000/api/organizer';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getOrganizerSettings = async () => {
  const response = await axios.get(`${API_URL}/settings`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const updateOrganizerSettings = async (settings) => {
  const response = await axios.put(`${API_URL}/settings`, settings, {
    headers: getAuthHeader(),
  });
  return response.data;
};
