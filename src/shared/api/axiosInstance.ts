import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// API 응답 표준 타입
export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (예: 토큰 자동 첨부)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 필요 시 토큰 추가
    // const token = localStorage.getItem('token');
    // if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 표준화)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // 에러 메시지 표준화
    return Promise.reject({
      success: false,
      data: null,
      error: error?.response?.data?.error || error.message || 'Unknown error',
    });
  }
);

export default axiosInstance;
