import { LoginForm } from '@/features/auth/components/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng Nhập | Hệ Thống',
  description: 'Đăng nhập vào hệ thống',
};

export default function LoginPage() {
  return <LoginForm />;
}
