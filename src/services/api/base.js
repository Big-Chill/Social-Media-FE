import axios from 'axios';
import { localStore } from '../browserStorage';
const axiosClient = axios.create();

axiosClient.defaults.baseURL = 'http://localhost:8001/api/v1/';

axiosClient.defaults.headers.common = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

axiosClient.defaults.withCredentials = true;

axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStore.get('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  async (config) => {
    const token = config.headers['authorization-jwt'];
    if (token) {
      localStore.set('jwtToken', token);
    }
    return config;
  },(error) => {
    return Promise.reject(error);
  }
);

export function getRequest(URL) {
  return axiosClient.get(`/${URL}`).then(response => response);
}

export function postRequest(URL, payload) {
  return axiosClient.post(`/${URL}`, payload).then(response => response);
}

export function putRequest(URL, payload) {
  return axiosClient.put(`/${URL}`, payload).then(response => response);
}

export function deleteRequest(URL, payload) {
  return axiosClient.delete(`/${URL}`, payload).then(response => response);
}

