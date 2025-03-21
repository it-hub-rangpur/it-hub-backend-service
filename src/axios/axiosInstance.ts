import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import https from "https";

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 60 * 60 * 1000,
  maxSockets: 1000,
  maxFreeSockets: 10,
});

const axiosInstance: AxiosInstance = axios.create({
  httpsAgent,
  withCredentials: true,
  maxRedirects: 0,
});

export default axiosInstance;
