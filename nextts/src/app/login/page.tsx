'use client';

import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Form, 
  Input, 
  Card, 
  Typography, 
  Divider, 
  Checkbox,
  Layout,
  message
} from 'antd';
import {
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined
} from '@ant-design/icons';
import styles from './page.module.css';

const { Title, Text} = Typography;
const { Content } = Layout;

interface IAuthFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const createFloatingElement = () => {
      const element = document.createElement('div');
      element.className = styles.floatingElement;
      element.style.left = Math.random() * 100 + '%';
      element.style.animationDelay = Math.random() * 6 + 's';
      
      const authSection = document.querySelector(`.${styles.authContainer}`);
      if (authSection) {
        authSection.appendChild(element);
        setTimeout(() => element.remove(), 6000);
      }
    };

    const interval = setInterval(createFloatingElement, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (values: IAuthFormData) => {

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (values != null) {
        message.success('Login successful! Welcome back.');
        window.location.href = '/dashboard';
      } 
    } 
    catch (error) {
      message.error('Login failed. Please try again.');
      console.log(error);
    } 
    finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.location.href = '/';
  };

  return (
    <Layout className={styles.layout}>
      <Content className={styles.authContainer}>
        <div className={styles.backgroundOverlay}></div>
          
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={goBack}
            className={styles.backButton}
          >
            Back to Home
          </Button>
        <div className={styles.authContent}>
            <div className={styles.logoSection}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>🤖</span>
                    Glass
                </div>
                <Text className={styles.logoSubtext}>
                    Intelligent Customer Support Platform
                </Text>
          </div>

          <Card className={styles.authCard}>
            <div className={styles.cardHeader}>
              <Title level={2} className={styles.authTitle}>
                Welcome Back
              </Title>
              <Text className={styles.authSubtitle}>
                Sign in to your account to continue
              </Text>
            </div>

            <Divider className={styles.divider}>
            </Divider>

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className={styles.authForm}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: 'white' }}  />}
                  placeholder="Email Address"
                  size="large"
                  className={styles.formInput}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'white' }}  />}
                  placeholder="Password"
                  size="large"
                  className={styles.formInput}
                  iconRender={(visible) => (visible ? <EyeTwoTone style={{ color: 'white' }} /> : <EyeInvisibleOutlined style={{ color: 'white' }} />)}
                />
              </Form.Item>

              <div className={styles.formOptions}>
                <div className={styles.loginOptions}>
                  <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                    <Checkbox className={styles.checkbox}>Remember me</Checkbox>
                  </Form.Item>
                </div>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className={styles.submitButton}
                  block
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <div className={styles.authFooter}>
            <Text className={styles.footerText}>
                By continuing, you agree to Glass&apos;s Terms of Service and Privacy Policy
            </Text>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthPage;