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

// Organizer — approve or reject a single application
export const updateApplicationStatus = async (id, status) => {
  const response = await axios.patch(
    `${API_URL}/applications/${id}/status`,
    { status },
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Organizer — approved volunteers for one event
export const getEventVolunteers = async (eventId) => {
  const response = await axios.get(`${API_URL}/event/${eventId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
