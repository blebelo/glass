'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  Form, 
  Input, 
  Card, 
  Typography, 
  Checkbox,
  Layout,
  message,
  Spin
} from 'antd';
import {
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useStyles } from './style'
import { ILogin } from '@/providers/auth-provider/context';
import { useAuthActions, useAuthState } from '@/providers/auth-provider';

const { Title, Text} = Typography;
const { Content } = Layout;

const AuthPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { isPending, isError, isSuccess} = useAuthState();
  const authActions = useAuthActions();
  const { styles } = useStyles(); 


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

  const handleSubmit = async (values: ILogin) => {
    try {
      authActions.loginUser(values);
    } 
    catch (error) {
      message.error('Login failed. Please try again.');
      console.log(error);
    } 
    finally {
    }
  };

  const goBack = () => {
    router.push('/');
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

            {isPending && (
              <div className={styles.stateOverlay}>
                <Spin size="large" />
              </div>
            )}

            {isError && (
              <div className={styles.stateOverlay}>
                <div className={styles.stateContent}>
                  <ExclamationCircleOutlined className={styles.errorIcon} />
                  <p>Cannot sign up at this time. Please try again later.</p>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className={styles.stateOverlay}>
                <div className={styles.stateContent}>
                  <CheckCircleOutlined className={styles.successIcon} />
                  <p>Successfully signed up!</p>
                </div>
              </div>
            )}

            <div className={styles.cardHeader}>
              <Title level={2} className={styles.authTitle}>
                Welcome Back
              </Title>
              <Text className={styles.authSubtitle}>
                Sign in to your account to continue
              </Text>
            </div>

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              className={styles.authForm}
            >
              <Form.Item
                name="userNameOrEmailAddress"
                rules={[
                  { required: true, message: 'Please enter your email or username' },
                  
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: 'white' }}  />}
                  placeholder="Email / Username"
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
                  <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                    <Checkbox className={styles.checkbox}>Remember me</Checkbox>
                  </Form.Item>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
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