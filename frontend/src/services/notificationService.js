import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getNotifications = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const myNotifications = async () => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/read`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
