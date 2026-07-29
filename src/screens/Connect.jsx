import axios from "axios";

const BASE_URL = "http://localhost:4000"; 

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

export const authenticateFitbit = () => {
  try {
    window.location.href = `${BASE_URL}/auth/fitbit`;
  } catch (error) {
    console.error("Error authenticating Fitbit:", error.message);
  }
};

export const handleFitbitCallback = async () => {
  try {
    const response = await api.get("/auth/fitbit/callback");
    return response.data; 
  } catch (error) {
    console.error("Error handling Fitbit callback:", error.message);
    throw error;
  }
};

export const fetchFitbitActivities = async (date) => {
  try {
    const response = await api.get("/fitbit/activities");
    return response.data; 
  } catch (error) {
    console.error("Error fetching Fitbit activities:", error.message);
    throw error;
  }
};
