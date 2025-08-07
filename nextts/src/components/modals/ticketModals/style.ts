import { createStyles, css } from "antd-style";

export const useStyles = createStyles({
  // Modal Container
  ticketModal: css`
    .ant-modal-content {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }

    .ant-modal-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-bottom: none;
      padding: 20px 24px;
    }

    .ant-modal-title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }

    .ant-modal-close {
      color: white;
      
      &:hover {
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .ant-modal-body {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .ant-modal-footer {
      border-top: 1px solid #f0f0f0;
      padding: 16px 24px;
      background: #fafafa;
    }
  `,

  // Modal Header
  modalHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  `,

  modalTitle: css`
    color: white;
    font-weight: 600;
    font-size: 18px;
  `,

  modalEditButton: css`
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      color: white;
      transform: translateY(-1px);
    }

    &:focus {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      color: white;
    }
  `,

  // Modal Content
  modalContent: css`
    padding: 0;
  `,

  // Ticket Descriptions
  ticketDescriptions: css`
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #f0f0f0;

    .ant-descriptions-header {
      background: #f8f9fa;
      padding: 16px 20px;
    }

    .ant-descriptions-title {
      font-weight: 600;
      color: #2c3e50;
    }

    .ant-descriptions-item-label {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
      border-right: 1px solid #e9ecef;
    }

    .ant-descriptions-item-content {
      background: white;
      padding: 12px 16px;
    }

    .ant-descriptions-row {
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
    }
  `,

  // Text Styles
  referenceText: css`
    color: #667eea;
    font-weight: 600;
    font-size: 16px;
  `,

  categoryTag: css`
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    padding: 4px 12px;
  `,

  priorityTag: css`
    border-radius: 8px;
    font-weight: 600;
    border: none;
    padding: 4px 12px;
  `,

  statusBadge: css`
    font-weight: 500;
    
    .ant-badge-status-dot {
      width: 8px;
      height: 8px;
    }
  `,

  locationText: css`
    color: #495057;
    font-weight: 500;
  `,

  customerText: css`
    color: #495057;
    font-weight: 500;
    font-family: monospace;
  `,

  updatesText: css`
    color: #495057;
  `,

  dateText: css`
    color: #6c757d;
    font-size: 14px;
  `,

  descriptionText: css`
    color: #2c3e50;
    line-height: 1.6;
    padding: 8px 0;
  `,

  reasonText: css`
    color: #495057;
    line-height: 1.6;
    padding: 8px 0;
  `,

  // Modal Divider
  modalDivider: css`
    margin: 24px 0;
    border-color: #e9ecef;
  `,

  // Assignment Section
  assignmentSection: css`
    margin-top: 16px;
  `,

  assignmentTitle: css`
    color: #2c3e50;
    margin-bottom: 16px;
    font-weight: 600;
  `,

  assignmentForm: css`
    .ant-form-item {
      margin-bottom: 16px;
    }
  `,

  formItem: css`
    .ant-form-item-label > label {
      color: #495057;
      font-weight: 600;
    }

    .ant-form-item-explain {
      color: #6c757d;
      font-size: 13px;
    }
  `,

  employeeSelect: css`
    border-radius: 8px;
    
    .ant-select-selector {
      border-radius: 8px;
      border: 2px solid #e9ecef;
      padding: 8px 12px;
      min-height: 48px;
      transition: all 0.3s ease;
    }

    &:hover .ant-select-selector {
      border-color: #667eea;
    }

    &.ant-select-focused .ant-select-selector {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .ant-select-selection-placeholder {
      color: #6c757d;
    }
  `,

  employeeOption: css`
    align-items: center;
    
    .ant-avatar {
      background: linear-gradient(135deg, #667eea, #764ba2);
      margin-right: 8px;
    }
  `,

  // Assigned Employees Display
  assignedEmployeesDisplay: css`
    padding: 16px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 1px solid #e9ecef;
  `,

  employeeTagsContainer: css`
    gap: 8px;
  `,

  employeeTag: css`
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    padding: 6px 12px;
    margin-bottom: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    .anticon {
      color: white;
    }
  `,

  noAssignmentText: css`
    color: #6c757d;
    font-style: italic;
    text-align: center;
    padding: 20px 0;
  `,

  // Modal Footer Buttons
  modalSaveButton: css`
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    height: 40px;
    padding: 0 20px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }
  `,

  modalCancelButton: css`
    border: 1px solid #d9d9d9;
    color: #595959;
    border-radius: 8px;
    height: 40px;
    padding: 0 20px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #667eea;
      color: #667eea;
    }

    &:focus {
      border-color: #667eea;
      color: #667eea;
    }
  `,

  modalCloseButton: css`
    background: #667eea;
    border: none;
    color: white;
    border-radius: 8px;
    font-weight: 500;
    height: 40px;
    padding: 0 20px;
    transition: all 0.3s ease;

    &:hover {
      background: #5a67d8;
      transform: translateY(-1px);
    }

    &:focus {
      background: #5a67d8;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }
  `,

  // Responsive Design
  '@media (max-width: 768px)': {
    ticketModal: css`
      .ant-modal {
        margin: 16px;
        max-width: calc(100vw - 32px);
      }

      .ant-modal-content {
        margin: 0;
      }

      .ant-modal-body {
        padding: 16px;
        max-height: 60vh;
      }
    `,

    modalHeader: css`
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    `,

    ticketDescriptions: css`
      .ant-descriptions {
        font-size: 14px;
      }

      .ant-descriptions-item-label {
        padding: 8px 12px;
      }

      .ant-descriptions-item-content {
        padding: 8px 12px;
      }
    `,

    employeeSelect: css`
      .ant-select-selector {
        min-height: 44px;
      }
    `,
  },

  '@media (max-width: 480px)': {
    ticketModal: css`
      .ant-modal {
        margin: 8px;
        max-width: calc(100vw - 16px);
      }

      .ant-modal-header {
        padding: 16px 20px;
      }

      .ant-modal-body {
        padding: 12px;
      }

      .ant-modal-footer {
        padding: 12px 20px;
      }
    `,

    ticketDescriptions: css`
      .ant-descriptions {
        column: 1;
      }
    `,

    modalEditButton: css`
      font-size: 12px;
      padding: 4px 8px;
      height: 32px;
    `,
  },
});