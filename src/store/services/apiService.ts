// services/apiService.ts
import { instance } from 'src/configs/instances';
import { getDecryptedItem } from 'src/utils/crypto';
import authConfig from 'src/configs/auth';
import { HttpStatus } from 'src/utils/HttpStatus';

const getToken = () => {
  // Aquí deberías usar tu lógica para obtener el token de almacenamiento local
  return getDecryptedItem(authConfig.storageTokenKeyName);
};

export const getHeaders = (data: { [key: string]: any }) => {
  const token = getToken();
  let headers = {
    'Authorization': `Bearer ${token}`
  };

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof File) {
      return { headers: { ...headers, 'Content-Type': 'multipart/form-data' } };
    }
  }
  return { headers: { ...headers, 'Content-Type': 'application/json' } };
};

export const apiService = {
  Post: async (endpoint: string, data: { [key: string]: any }) => {
    try {
      const response = await instance.post(endpoint, data, getHeaders(data));
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
  Get: async (endpoint: string, param?: {}) => {
    try {
      const response = await instance.get(endpoint, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
        params: param
      });
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
  GetId: async (endpoint: string, id: string | number) => {
    try {
      const response = await instance.get(`${endpoint}/${id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
  Update: async (endpoint: string, data: { [key: string]: any }, id: string | number) => {
    try {
      const response = await instance.put(`${endpoint}/${id}`, data, getHeaders(data));
      return response;
    } catch (error: any) {
      return error.response;
    }
  },
  Delete: async (endpoint: string, id: string | number) => {
    try {
      const response = await instance.delete(`${endpoint}/${id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      return response;
    } catch (error: any) {
      return error.response;
    }
  }
};
