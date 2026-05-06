import axios from 'axios';
import { Platform } from 'react-native';

// For local testing on emulator/device, you typically can't use localhost.
// Use your local IP address here instead of localhost, e.g., 192.168.1.100
// For android emulator: 10.0.2.2
const getBaseUrl = () => {
  if (__DEV__) {
    // Both iOS and physical Android devices should hit your exact laptop IP
    return 'http://10.196.128.144:8000'; 
  }
  return 'https://api.yourproductiondomain.com';
};

const BASE_URL = getBaseUrl();

export const uploadImageForDetection = async (imageUri, userEmail = null) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'shelf_scan.jpg',
  });
  if (userEmail) {
    formData.append('user_email', userEmail);
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/detect`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const getStats = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/stats`);
        return response.data;
    } catch (error) {
        console.error("Error getting stats:", error);
        throw error;
    }
}

export const getHistory = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/history`);
        return response.data;
    } catch (error) {
        console.error("Error getting history:", error);
        throw error;
    }
}
