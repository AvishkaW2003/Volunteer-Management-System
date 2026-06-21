import axios from 'axios';

const API_URL = 'http://localhost:5000/api/attendance';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAttendanceByEvent = async (eventId) => {
  const response = await axios.get(`${API_URL}/${eventId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const saveAttendance = async (eventId, records) => {
  const response = await axios.post(
    API_URL,
    { eventId, records },
    { headers: getAuthHeader() }
  );
  return response.data;
};
