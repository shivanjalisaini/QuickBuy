import axios from "axios";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export const post = async (endpoint, data, config) => {
  try {
    console.log(`${REACT_APP_BASE_URL}${endpoint}`);
    const response = await axios.post(
      `${REACT_APP_BASE_URL}${endpoint}`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error making POST request:", error);
    throw error;
  }
};

export const get = async (endpoint, config) => {
  try {
    const response = await axios.get(
      `${REACT_APP_BASE_URL}${endpoint}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error making GET request:", error);
    throw error;
  }
};

export const put = async (endpoint, data, config) => {
  try {
    const response = await axios.put(
      `${REACT_APP_BASE_URL}${endpoint}`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error making PUT request:", error);
    throw error;
  }
};

export const del = async (endpoint, config) => {
  try {
    const response = await axios.delete(
      `${REACT_APP_BASE_URL}${endpoint}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error making DELETE request:", error);
    throw error;
  }
};