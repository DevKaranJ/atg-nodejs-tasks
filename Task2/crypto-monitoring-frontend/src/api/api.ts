import axios from 'axios';

// Base URL for your backend API
const BASE_URL = 'http://localhost:3000';

export const getPrices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/prices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
};

export const getCachedPrices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/cached-prices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cached prices:', error);
    throw error;
  }
};

export const setAlertCriteria = async (threshold: number) => {
  try {
    await axios.post(`${BASE_URL}/set-alert-criteria`, { threshold });
  } catch (error) {
    console.error('Error setting alert criteria:', error);
    throw error;
  }
};
