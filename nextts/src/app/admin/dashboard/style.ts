import { createStyles, css } from "antd-style";

export const useStyles = createStyles({
  // Layout
  layout: css`
    min-height: 100vh;
    background: #f5f7fa;
  `,

  header: css`
    background: linear-gradient(135deg, #667eea, #764ba2);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  headerTitle: css`
    display: flex;
    align-items: center;
  `,

  headerTitleText: css`
    color: white;
    margin: 0;
  `,

  headerUserText: css`
    color: white;
  `,

  sider: css`
    background: white;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  `,

  menu: css`
    border: none;
    padding: 16px 8px;
  `,

  menuItem: css`
    border-radius: 8px;
    margin: 4px 0;
    height: 48px;
    display: flex;
    align-items: center;
  `,

  content: css`
    background: #f5f7fa;
  `,

  pageContainer: css`
    padding: 24px;
  `,

  // Stats Cards
  gradientCard: css`
    border-radius: 16px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    color: white;
  `,

  regularCard: css`
    border-radius: 16px;
    border: 1px solid #f0f0f0;
  `,

  roundedCard: css`
    border-radius: 16px;
  `,

  statisticTitle: css`
    color: rgba(255, 255, 255, 0.9);
  `,

  statisticValue: css`
    color: white;
    font-size: 2rem;
    font-weight: bold;
  `,

  statisticValueBlue: css`
    color: #1890ff;
    font-size: 2rem;
    font-weight: bold;
  `,

  statisticValueYellow: css`
    color: #faad14;
    font-size: 2rem;
    font-weight: bold;
  `,

  statisticValueGreen: css`
    color: #52c41a;
    font-size: 2rem;
    font-weight: bold;
  `,

  // Team Performance
  teamMemberContainer: css`
    margin-bottom: 16px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
  `,

  teamMemberSpace: css`
    width: 100%;
    justify-content: space-between;
  `,

  teamMemberInfo: css`
    font-size: 12px;
  `,

  teamPerformanceContainer: css`
    text-align: right;
  `,

  // Team Cards
  teamCard: css`
    border-radius: 16px;
    text-align: center;
  `,

  teamCardTitle: css`
    margin: 8px 0;
    color: #2c3e50;
  `,

  teamCardAvatar: css`
    margin-bottom: 16px;
  `,

  teamCardStats: css`
    margin-top: 16px;
  `,

  teamCardPerformance: css`
    margin-top: 16px;
  `,

  teamCardPerformanceText: css`
    font-size: 12px;
  `,

  teamCardProgress: css`
    margin: 8px 0;
  `,

  teamCardResolution: css`
    margin-top: 12px;
  `,

  teamCardResolutionText: css`
    font-size: 12px;
  `,

  // Filters
  filterInput: css`
    border-radius: 8px;
  `,

  filterSelect: css`
    width: 100%;
    border-radius: 8px;
  `,

  filterButton: css`
    width: 100%;
    border-radius: 8px;
  `,

  // Table
  ticketIdText: css`
    color: #667eea;
  `,

  ticketTitleText: css`
    color: #2c3e50;
  `,

  priorityTag: css`
    border-radius: 12px;
    font-weight: 600;
  `,

  statusBadge: css`
    font-weight: 500;
  `,

  categoryTag: css`
    border-radius: 8px;
  `,

  tablePagination: css`
    margin-top: 24px;
  `,

  // Analytics
  analyticsChart: css`
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    border-radius: 8px;
  `,

  // Responsive spacing
  cardMargin: css`
    margin-bottom: 32px;
  `,

  sectionMargin: css`
    margin-bottom: 24px;
  `,

  rowMargin: css`
    margin-top: 24px;
  `,

  // Text styles
  whiteIcon: css`
    color: white;
  `,

  blueIcon: css`
    color: #1890ff;
  `,

  yellowIcon: css`
    color: #faad14;
  `,

  greenIcon: css`
    color: #52c41a;
  `,

  greenSmallIcon: css`
    color: #52c41a;
    font-size: 14px;
  `,
});