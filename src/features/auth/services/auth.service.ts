import { api } from '@/lib/axios';
import { LoginFormData } from '../schemas/auth.schema';
import { LoginResponse } from '../types/auth';

export const authService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    // Call the original external API for login
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    }
  }
};
