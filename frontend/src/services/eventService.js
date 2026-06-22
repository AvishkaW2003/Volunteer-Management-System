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

// Get single event by ID (public)
export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create event (organizer only)
export const createEvent = async (eventData) => {
  const response = await axios.post(API_URL, eventData, {
    headers: getAuthHeader(),
  });
  return response.data;
};