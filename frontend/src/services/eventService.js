import axios from 'axios';
import AuthService from './authService';

const API_URL = 'http://localhost:5000/api/v1/events';

const createEvent = (eventData) => {
  const token = AuthService.getAuthToken();

  return axios.post(`${API_URL}/create`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getMyEvents = () => {
  const token = AuthService.getAuthToken();

  return axios.get(`${API_URL}/my-events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getPublicEvents = () => {
  return axios.get(`${API_URL}/public`);
};

export default {
  createEvent,
  getMyEvents,
  getPublicEvents,
};
