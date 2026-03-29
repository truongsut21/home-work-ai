import type { Metadata } from 'next';
import './globals.css';
import AntdProvider from '@/components/providers/antd-provider';

export const metadata: Metadata = {
  title: 'Cô Minh English - AI English Teacher',
  description: 'Học tiếng Anh cùng Cô Minh - giáo viên AI hài hước và thân thiện. Learn English with Co Minh - your fun AI English teacher!',
  keywords: ['english', 'learn english', 'ai teacher', 'chatbot', 'co minh'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        <AntdProvider>
          {children}
        </AntdProvider>
      </body>
    </html>
  );
}
