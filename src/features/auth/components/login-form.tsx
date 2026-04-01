'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { LockOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/use-auth';
import { LoginFormData } from '../schemas/auth.schema';
import styles from './login-form.module.css';

export const LoginForm = () => {
  const { login, loading } = useAuth();
  const [form] = Form.useForm<LoginFormData>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const onFinish = (values: LoginFormData) => {
    login(values);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Animated orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{ '--i': i } as React.CSSProperties}
        />
      ))}

      {/* Main card */}
      <div className={`${styles.card} ${mounted ? styles.cardVisible : ''}`}>

        {/* Left decorative panel */}
        <div className={styles.leftPanel}>
          <div className={styles.leftPanelContent}>
            <div className={styles.brandLogo}>
              <LockOutlined className={styles.brandIcon} />
            </div>
            <h1 className={styles.brandTitle}>Xin chào!</h1>
            <p className={styles.brandSubtitle}>
              Đăng nhập để truy cập vào hệ thống quản lý của bạn
            </p>
            <div className={styles.brandDots}>
              <span className={`${styles.dot} ${styles.dotActive}`} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className={styles.rightPanel}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Đăng nhập</h2>
            <p className={styles.formSubtitle}>Vui lòng nhập thông tin tài khoản</p>
          </div>

          <Form
            form={form}
            name="login_form"
            layout="vertical"
            onFinish={onFinish}
            size="large"
            className={styles.form}
          >
            {/* Email */}
            <Form.Item
              name="email"
              className={styles.formItem}
              rules={[
                { required: true, message: 'Vui lòng nhập tài khoản!' },
              ]}
            >
              <Input
                prefix={<UserOutlined className={styles.inputIcon} />}
                placeholder="Địa chỉ Email"
                className={styles.customInput}
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              className={styles.formItem}
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className={styles.inputIcon} />}
                placeholder="Mật khẩu"
                className={styles.customInput}
              />
            </Form.Item>

            {/* Forgot password */}
            <div className={styles.forgotRow}>
              <a className={styles.forgotLink}>Quên mật khẩu?</a>
            </div>

            {/* Submit */}
            <Form.Item className={styles.submitItem}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className={styles.submitBtn}
                icon={!loading ? <ArrowRightOutlined /> : undefined}
                iconPlacement="end"
              >
                {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
              </Button>
            </Form.Item>
          </Form>

          <p className={styles.footerText}>
            © {new Date().getFullYear()} Hệ Thống Quản Lý. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
