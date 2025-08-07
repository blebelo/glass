'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Statistic, Layout, Menu, Typography } from 'antd';
import { 
  RocketOutlined, 
  ShrinkOutlined, 
  ThunderboltOutlined, 
  GlobalOutlined,
  BarChartOutlined,
  LockOutlined,
  ApiOutlined,
  MenuOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card 
      className={`${styles.featureCard} ${isVisible ? styles.fadeIn : ''}`}
      hoverable
    >
      <div className={styles.featureIcon}>{icon}</div>
      <Title level={3} className={styles.featureTitle}>{title}</Title>
      <Paragraph className={styles.featureDescription}>{description}</Paragraph>
    </Card>
  );
};

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      router.push('/login');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigationItems = [
    { key: 'features', label: 'Features', onClick: () => scrollToSection('features') },
    { key: 'pricing', label: 'Pricing', onClick: () => scrollToSection('pricing') },
    { key: 'about', label: 'About', onClick: () => scrollToSection('about') },
    { key: 'contact', label: 'Contact', onClick: () => scrollToSection('contact') },
  ];

  const features = [
    {
      icon: <ShrinkOutlined />,
      title: 'Smart AI Responses',
      description: 'Advanced natural language processing understands context and provides intelligent, personalized responses to customer inquiries.'
    },
    {
      icon: <ThunderboltOutlined />,
      title: 'Instant Resolution',
      description: 'Resolve 80% of customer queries instantly with our knowledge base integration and automated problem-solving capabilities.'
    },
    {
      icon: <GlobalOutlined />,
      title: 'Multi-Language Support',
      description: 'Communicate with customers in multiple languages with real-time translation and culturally aware responses.'
    },
    {
      icon: <BarChartOutlined />,
      title: 'Analytics Dashboard',
      description: 'Track performance metrics, customer satisfaction, and identify trends with comprehensive analytics and reporting.'
    },
    {
      icon: <LockOutlined />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, GDPR compliance, and secure data handling ensure your customer data is always protected.'
    },
    {
      icon: <ApiOutlined />,
      title: 'Easy Integration',
      description: 'Seamlessly integrate with your existing tools and platforms through our comprehensive API and webhook system.'
    }
  ];

  const stats = [
    { title: '99.9%', value: 'Uptime Guarantee' },
    { title: '50k+', value: 'Happy Customers' },
    { title: '2.5M+', value: 'Conversations Daily' },
    { title: '85%', value: 'Cost Reduction' }
  ];

  useEffect(() => {
    const createFloatingElement = () => {
      const element = document.createElement('div');
      element.className = styles.floatingElement;
      element.style.left = Math.random() * 100 + '%';
      element.style.animationDelay = Math.random() * 6 + 's';
      
      const heroSection = document.querySelector(`.${styles.hero}`);
      if (heroSection) {
        heroSection.appendChild(element);
        setTimeout(() => element.remove(), 6000);
      }
    };

    const interval = setInterval(createFloatingElement, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.nav}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🤖</span>Glass
            </div>
            
            <div className={styles.desktopMenu}>
              <Menu 
                mode="horizontal" 
                items={navigationItems}
                className={styles.navMenu}
                style={{ background: 'transparent', border: 'none' }}
              />
            </div>

            <Button
              className={styles.mobileMenuBtn}
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
            />
          </div>
        </div>
      </Header>

      <Content>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}></div>
          <div className={styles.container}>
            <div className={`${styles.heroContent} ${styles.fadeIn}`}>
              <Title level={1} className={styles.heroTitle}>
                Intelligent Support<br />That Never Sleeps
              </Title>
              <Paragraph className={styles.heroSubtitle}>
                Transform your customer support with AI-powered conversations that understand, 
                engage, and resolve issues 24/7 with human-like intelligence.
              </Paragraph>
              <div className={styles.ctaButtons}>

                <Button 
                  type="primary" 
                  size="large"
                  icon={<RocketOutlined />}
                  loading={loading}
                  onClick={handleLogin}
                  className={styles.btnPrimary}
                >
                  Get Started
                </Button>

                <Button 
                  size="large"
                  icon={<SearchOutlined />}
                  onClick={() => router.push('/dashboard')}
                  className={styles.btnSecondary}
                >
                  View Tickets
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.features}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <Title level={2} className={styles.sectionTitle}>Powerful Features</Title>
              <Paragraph className={styles.sectionSubtitle}>
                Everything you need to deliver exceptional customer support experiences
              </Paragraph>
            </div>
            
            <Row gutter={[32, 32]} className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <FeatureCard 
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={index * 100}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.stats}>
          <div className={styles.container}>
            <Row gutter={[32, 32]}>
              {stats.map((stat, index) => (
                <Col xs={12} md={6} key={index}>
                  <div className={styles.statItem}>
                    <Statistic 
                      title={stat.value}
                      value={stat.title}
                      valueStyle={{ 
                        color: '#3498db',
                        fontSize: '48px',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #3498db, #2980b9)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                      className={styles.statistic}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      </Content>

      <Footer className={styles.footer}>
        <div className={styles.container}>
          <Row gutter={[32, 32]} className={styles.footerContent}>
            <Col xs={24} sm={12} md={6}>
              <Title level={4} className={styles.footerTitle}>Product</Title>
              <div className={styles.footerLinks}>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">API Documentation</a>
                <a href="#">Integrations</a>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={4} className={styles.footerTitle}>Company</Title>
              <div className={styles.footerLinks}>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
                <a href="#">Contact</a>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={4} className={styles.footerTitle}>Support</Title>
              <div className={styles.footerLinks}>
                <a href="#">Help Center</a>
                <a href="#">Community</a>
                <a href="#">Status</a>
                <a href="#">Security</a>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={4} className={styles.footerTitle}>Connect</Title>
              <Paragraph className={styles.footerDescription}>
                Transform your customer support experience with intelligent AI that 
                understands and adapts to your business needs.
              </Paragraph>
            </Col>
          </Row>
          <div className={styles.footerBottom}>
            <Paragraph>© 2025 Benny Lebelo. All rights reserved.</Paragraph>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default LandingPage;