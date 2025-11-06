import axios from 'axios';

export const apiDev = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
});
