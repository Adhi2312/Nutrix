import axios from "axios";
import { API_BASE_URL } from '../api';

const BASE_URL = API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

export const authenticateGoogleHealth = () => {
  try {
    const returnTo = encodeURIComponent(window.location.origin);
    window.location.href = `${BASE_URL}/auth/google-health?returnTo=${returnTo}`;
  } catch (error) {
    console.error("Google Health authentication failed.");
  }
};

export const fetchHealthConnection = async () => {
  const response = await api.get('/health/connection');
  return response.data;
};

export const fetchHealthActivities = async (date) => {
  try {
    const response = await api.get("/health/activities", {
      params: date ? { date } : undefined,
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    error.status = status;

    if (status === 401) {
      throw error;
    }

    console.error("Health activity request failed.", status || error.message);
    throw error;
  }
};
