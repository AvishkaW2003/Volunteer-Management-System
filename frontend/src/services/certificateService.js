import axios from 'axios';

const API_URL = 'http://localhost:5000/api/certificates';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Student: get own certificates
export const getMyCertificates = async () => {
  const response = await axios.get(`${API_URL}/my-certificates`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Organizer: eligible checklist
export const getEligibleVolunteers = async (eventId) => {
  const response = await axios.get(`${API_URL}/eligible/${eventId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Organizer: generate certificate
export const generateCertificate = async (eventId, userId, hours) => {
  const response = await axios.post(
    `${API_URL}/generate`,
    { eventId, userId, hours },
    { headers: getAuthHeader() }
  );
  return response.data;
};
