import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Types based on OpenAPI schema
export interface MassChatAccount {
  id?: number | null;
  im_livechat_channel_id?: number | null;
  company_id?: number | null;
  mass_chat_stage_id?: number | null;
  create_uid?: number | null;
  write_uid?: number | null;
  name?: string | null;
  endpoint?: string | null;
  instanceId?: string | null;
  token?: string | null;
  phoneNumber?: string | null;
  create_date?: string | null;
  write_date?: string | null;
  provider?: string | null;
  timeout_hours?: number | null;
  welcome_text?: string | null;
  welcome_url_media?: string | null;
}

export interface ApiError {
  detail: {
    loc: (string | number)[];
    msg: string;
    type: string;
  }[];
}

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8099';
    
    console.log(`API Service initialized with base URL: ${this.baseURL}`);
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      const token = useAuthStore.getState().auth.accessToken;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log detailed error information
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('API Error Response:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            endpoint: error.config.url,
            method: error.config.method
          });
          
          if (error.response.status === 401) {
            // Token expired or invalid
            useAuthStore.getState().auth.reset();
            // You might want to redirect to login page here
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('API No Response:', {
            request: error.request,
            endpoint: error.config.url,
            method: error.config.method
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('API Request Error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async checkTokenStatus() {
    try {
      return await this.api.get('/auth/token-status');
    } catch (error) {
      console.error('Error checking token status:', error);
      throw error;
    }
  }

  // Account endpoints
  async getAccounts() {
    try {
      const response = await this.api.get<MassChatAccount[]>('/accounts');
      return response.data;
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  }

  async createAccount(account: MassChatAccount) {
    try {
      const response = await this.api.post<MassChatAccount>('/accounts', account);
      return response.data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async getAccount(accountId: number) {
    try {
      const response = await this.api.get<MassChatAccount>(`/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting account:', accountId, error);
      throw error;
    }
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService; 