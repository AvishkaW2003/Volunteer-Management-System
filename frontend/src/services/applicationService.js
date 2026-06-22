import axios from 'axios';

const API_URL = 'http://localhost:5000/api/applications';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Student applies for an event
export const applyToEvent = async (eventId, formData) => {
  const response = await axios.post(
    API_URL,
    { eventId, formData },
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Student retrieves their own applications
export const getMyApplications = async () => {
  const response = await axios.get(`${API_URL}/my-applications`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Organizer retrieves statistics
export const getApplicationStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Organizer retrieves applications for a specific event
export const getOrganizerApplications = async (eventId) => {
  const response = await axios.get(`${API_URL}/event/${eventId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};