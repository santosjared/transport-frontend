import { useState } from "react";
import { instance } from "src/configs/instances";

// Obtener el token de almacenamiento local
const getToken = () => {
  return localStorage.getItem('accessToken');
};

export const useService = () => {
  const getHeaders = (data: { [key: string]: any }) => {
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

  const Post = async (endpoint: string, data: { [key: string]: any }) => {
    try {
      const response = await instance.post(endpoint, data, getHeaders(data));
      return response;
    } catch (error: any) {
      return error.response;
    }
  };

  const Get = async (endpoint: string, param?: {}) => {
    try {
      const response = await instance.get(endpoint, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
        params: param
      });
      return response;
    } catch (error: any) {
      return error.response;
    }
  };

  const GetId = async (endpoint: string, id: string | number) => {
    try {
      const response = await instance.get(`${endpoint}/${id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      return response;
    } catch (error: any) {
      return error.response;
    }
  };

  const Update = async (endpoint: string, data: { [key: string]: any }, id: string | number) => {
    try {
      const response = await instance.put(`${endpoint}/${id}`, data, getHeaders(data));
      return response;
    } catch (error: any) {
      return error.response;
    }
  };

  const Delete = async (endpoint: string, id: string | number) => {
    try {
      const response = await instance.delete(`${endpoint}/${id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      return response;
    } catch (error: any) {
      return error.response;
    }
  };

  return {
    Post,
    Get,
    GetId,
    Update,
    Delete
  };
};
