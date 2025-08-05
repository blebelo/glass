import { createStyles, css } from "antd-style";

export const useStyles = createStyles({
  // Layout
  layout: css`
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
  `,

  authContainer: css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    position: relative;
    z-index: 2;
  `,

  backgroundOverlay: css`
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1000px;
      height: 1000px;
      background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulse 6s ease-in-out infinite;
      z-index: 1;
    }
  `,

  // Back Button
  backButton: css`
    position: absolute;
    top: 20px;
    left: 20px;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    border-radius: 50px;
    padding: 8px 20px;
    height: auto;
    font-weight: 500;
    transition: all 0.3s ease;
    z-index: 10;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      color: white;
      transform: translateY(-2px);
    }
  `,

  // Auth Content
  authContent: css`
    width: 100%;
    max-width: 450px;
    position: relative;
    z-index: 3;
  `,

  // Logo Section
  logoSection: css`
    text-align: center;
    margin-bottom: 40px;
  `,

  logo: css`
    font-size: 32px;
    font-weight: 800;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 8px;
  `,

  logoIcon: css`
    font-size: 36px;
    animation: bounce 2s infinite;
  `,

  logoSubtext: css`
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
  `,

  // Auth Card
  authCard: css`
    background: transparent;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    padding: 0;
    overflow: hidden;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      z-index: 1;
    }

    .ant-card-body {
      padding: 40px;
      position: relative;
      z-index: 2;
    }
  `,

  // Card Header
  cardHeader: css`
    text-align: center;
    margin-bottom: 32px;
  `,

  authTitle: css`
    color: white;
    font-weight: 800;
    font-size: 28px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #ffffff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `,

  authSubtitle: css`
    color: rgba(255, 255, 255, 1);
    font-size: 16px;
    line-height: 1.5;
  `,

  // Form
  spinnerOverlay: css`
    color: white;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(95, 56, 185, 0.3);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
    border-radius: 1.5rem;

    .ant-spin-dot-item {
    background-color: white;
    }

    .ant-spin-text {
    color: white;
    }
  `,

  authForm: css`
    width: 100%;

    .ant-form-item {
      margin-bottom: 20px;
      transition: all 0.3s ease;
    }

    .ant-form-item-has-error .formInput {
      border-color: #ff4d4f;
      box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.1);
    }

    .ant-form-item-explain-error {
      color: #ff4d4f;
      font-size: 14px;
      margin-top: 4px;
    }

    a {
      color: #667eea;
      transition: color 0.3s ease;

      &:hover {
        color: #5a67d8;
      }
    }
  `,

formInput: css`
    height: 48px;
    border-radius: 12px;
    border: 2px solid #f0f0f03e;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: transparent !important;

    &::placeholder {
      color: rgba(228, 0, 0, 1);
    }

    &:hover,
    &:active{
      border-color: #d1d9ff;
      background: transparent !important;
    }

    &:focus,
    &.ant-input-focused {
      background: transparent !important;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* Fix autofill background */
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px transparent inset !important;
      -webkit-text-fill-color: white !important;
      background-color: transparent !important;
      background: transparent !important;
    }
    .anticon {
      color: white;
    }

    input.ant-input {
      color: white;
      background: transparent !important;

      &:focus,
      &:active {
        color: white;
        background: transparent !important;
      }
    }

    /* Target Ant Design wrapper */
    &.ant-input-affix-wrapper {
      background: transparent !important;
      background-color: transparent !important;
    }
  `,

  // Form Options
  formOptions: css`
    margin-bottom: 24px;
  `,

  checkbox: css`
    color: #c1cccc;

    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #667eea;
      border-color: #667eea;
    }
  `,

  // Submit Button
  submitButton: css`
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);

      &::before {
        left: 100%;
      }
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    &.ant-btn-loading {
      pointer-events: none;

      .ant-btn-loading-icon {
        color: white;
      }
    }
  `,

  // Auth Switch
  authSwitch: css`
    text-align: center;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
  `,

  switchButton: css`
    color: #667eea;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: #5a67d8;
    }
  `,

  // Footer
  authFooter: css`
    text-align: center;
    margin-top: 2rem;
    color: white;
  `,

  footerText: css`
    color: #ffffff70;
  `,

  // Floating Elements
  floatingElement: css`
    position: absolute;
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    pointer-events: none;
    animation: float 8s linear infinite;
    z-index: 1;
  `,

  // Animations
  animations: css`
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { 
        transform: translateY(0); 
      }
      40% { 
        transform: translateY(-8px); 
      }
      60% { 
        transform: translateY(-4px); 
      }
    }

    @keyframes pulse {
      0%, 100% { 
        transform: translate(-50%, -50%) scale(1); 
        opacity: 0.1; 
      }
      50% { 
        transform: translate(-50%, -50%) scale(1.05); 
        opacity: 0.05; 
      }
    }

    @keyframes float {
      0% { 
        transform: translateY(100vh) rotate(0deg); 
        opacity: 0; 
      }
      10% { 
        opacity: 1; 
      }
      90% { 
        opacity: 1; 
      }
      100% { 
        transform: translateY(-100px) rotate(360deg); 
        opacity: 0; 
      }
    }
  `,

  // Responsive Design
  responsive: css`
    @media (max-width: 768px) {
      .authContainer {
        padding: 16px;
      }
      
      .authContent {
        max-width: 100%;
      }
      
      .authCard .ant-card-body {
        padding: 24px;
      }
      
      .authTitle {
        font-size: 24px;
      }
      
      .loginOptions {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
      
      .backButton {
        top: 16px;
        left: 16px;
        font-size: 14px;
        padding: 6px 16px;
      }

      .logoSection {
        margin-bottom: 32px;
      }

      .logo {
        font-size: 28px;
      }

      .logoIcon {
        font-size: 32px;
      }
    }

    @media (max-width: 480px) {
      .authContainer {
        padding: 12px;
      }
      
      .authCard .ant-card-body {
        padding: 20px;
      }
      
      .formInput {
        height: 44px;
        font-size: 15px;
      }
      
      .submitButton {
        height: 44px;
        font-size: 15px;
      }
    }
  `,
});