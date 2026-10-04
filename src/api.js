export const API_BASE_URL = process.env.REACT_APP_API_URL
  || 'https://nutrix-api-adhi2312.onrender.com';

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
