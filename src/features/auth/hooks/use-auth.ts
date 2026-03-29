import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { message } from 'antd';
import { authService } from '../services/auth.service';
import { LoginFormData } from '../schemas/auth.schema';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      
      const accessToken = response.accessToken || (response as any).token;
      const refreshToken = response.refreshToken;
      
      if (!accessToken) {
        throw new Error('Đăng nhập thất bại: Không nhận được token từ server.');
      }

      // Token 30 phút = 30 / (24 * 60) ngày
      Cookies.set('accessToken', accessToken, { expires: 30 / (24 * 60) });
      
      // Refresh token 30 ngày
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { expires: 30 });
      } else {
        // Fallback or handle differently if the backend API doesn't return refresh token initially
        // You could also set a dummy refresh token if needed, but omitted for now.
      }
      
      message.success('Đăng nhập thành công');
      router.push('/');
      router.refresh();
      
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error.message || 'Đăng nhập thất bại';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // fail silently
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      router.push('/login');
      router.refresh();
    }
  };

  return { login, logout, loading };
};
