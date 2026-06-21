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

// Get dashboard stats for the logged-in organizer
export const getOrganizerStats = async () => {
  const response = await axios.get(`${API_URL}/organizer/stats`, {
    headers: getAuthHeader(),
  });
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

// Update event (organizer only)
export const updateEvent = async (id, eventData) => {
  const response = await axios.put(`${API_URL}/${id}`, eventData, {
    headers: getAuthHeader(),
  });
  return response.data;
};
// Delete event (organizer only)
export const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Register as volunteer for an event (student only)
export const registerForEvent = async (eventId) => {
  const response = await axios.post(
    `http://localhost:5000/api/volunteers/register/${eventId}`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Get volunteers for an event (organizer only)
export const getEventVolunteers = async (eventId) => {
  const response = await axios.get(
    `http://localhost:5000/api/volunteers/event/${eventId}`,
    { headers: getAuthHeader() }
  );
  return response.data;
};
