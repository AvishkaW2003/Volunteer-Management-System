import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all events (public)
export const getEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get events created by the logged-in organizer
export const getMyEvents = async () => {
  const response = await axios.get(`${API_URL}/organizer/mine`, {
    headers: getAuthHeader(),
  });
  return response.data;
};