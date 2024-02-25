import axios from 'axios';
import getConfig from '../configs/environment'
const axiosInstance = axios.create({
  baseURL: getConfig().backendURI,
  timeout: 1000
});

export default axiosInstance;