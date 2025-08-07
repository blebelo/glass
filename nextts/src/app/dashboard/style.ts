import { createStyles, css } from "antd-style";

export const useStyles = createStyles({
  kanbanPage: css`
    padding: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    min-height: 100vh;
    color: white;
  `,

  sectionTitle: css`
    font-size: 48px !important;
    font-weight: 800 !important;
    color: white !important;
    margin-bottom: 20px !important;
    text-align: center; /* Center title text */
  `,

  sectionSubtitle: css`
    font-size: 20px !important;
    color: rgba(255, 255, 255, 0.7) !important;
    max-width: 600px;
    margin-bottom: 40px !important;
    margin-left: auto;
    margin-right: auto;
    text-align: center; /* Center subtitle text */
  `,

  statsContainer: css`
    margin-bottom: 24px;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .ant-statistic {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .ant-statistic-title {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    .ant-statistic-content-value {
      color: white;
      font-weight: bold;
      font-size: 1.8rem;
    }
  `,

  kanbanGrid: css`
    margin-top: 20px;
  `,

  kanbanColumn: css`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-height: 350px;
    padding: 16px;
    color: white;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 80vh;

    .ant-card-head-title {
      color: white !important;
      font-weight: 700;
      text-align: center;
    }
  `,

  ticketCard: css`
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    margin-bottom: 12px; /* slightly smaller gap */
    padding: 12px 16px; /* less vertical padding */
    transition: all 0.3s ease;
    cursor: pointer;
    color: white;
    width: 100%;
    min-height: 80px;

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
      background: rgba(255, 255, 255, 0.25);
    }
  `,

  ticketMeta: css`
    margin-top: 12px;
    font-weight: 600;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  `,

  tagOpen: css`
    background-color: #ff4d4f;
    color: white;
    font-weight: 600;
  `,

  tagInProgress: css`
    background-color: #fa8c16;
    color: white;
    font-weight: 600;
  `,

  tagResolved: css`
    background-color: #52c41a;
    color: white;
    font-weight: 600;
  `,

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
      color: white;
      transform: translateY(-2px);
    }
  `,
});
