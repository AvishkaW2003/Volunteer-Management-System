import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const registerStudent = async (userData) => {
  const response = await axios.post(`${API_URL}/register/student`, userData);
  return response.data;
};

export const registerOrganizer = async (userData) => {
  const response = await axios.post(`${API_URL}/register/organizer`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const getUserProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password/${token}`, { newPassword });
  return response.data;
};
