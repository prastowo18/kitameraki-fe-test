import axios, { AxiosRequestConfig } from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:7071',
});

const ApiClient = <T>(requestConfig: AxiosRequestConfig): Promise<T> =>
  AxiosInstance.request(requestConfig);

export interface ErrorResponse {
  data: null;
  error: {
    details: object;
    message: string;
    name: string;
    status: number;
  };
}

export { ApiClient };
