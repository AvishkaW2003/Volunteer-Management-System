import axios from 'axios';

const API_URL = 'http://localhost:5000/api/certificates';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCertificates = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeader() });
  return response.data;
};

export const issueCertificate = async ({ userId, eventId, issueDate, hours }) => {
  const response = await axios.post(
    API_URL,
    { userId, eventId, issueDate, hours },
    { headers: getAuthHeader() }
  );
  return response.data;
};
