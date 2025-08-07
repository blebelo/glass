'use client';
import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Typography,
  Descriptions,
  Divider,
  Button,
  Tag,
  Badge,
  Avatar,
  Space,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useStyles } from "./style";
import { IEmployee } from "@/providers/employee-provider/context";
import { ITicket } from "@/providers/ticket-provider/context";
import { IConstants } from "@/app/admin/dashboard/types";

const { Title, Text } = Typography;
const { Option } = Select;

interface ITicketDetailModalProps {
  visible: boolean;
  ticket: ITicket | null;
  employees: IEmployee[];
  constants: IConstants;
  onSave?: (ticketId: string, assignedEmployeeIds: string[]) => void;
  onCancel?: () => void;
}

const AssignEmployeeModal: React.FC<ITicketDetailModalProps> = ({
  visible,
  ticket,
  employees,
  constants,
  onSave,
  onCancel,
}) => {
  const { styles } = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (ticket && visible) {
      form.setFieldsValue({
        assignedEmployees: ticket.assignedEmployees.map((emp) => emp.id),
      });
      setIsEditing(false);
    }
  }, [ticket, visible, form]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing && ticket) {
      form.setFieldsValue({
        assignedEmployees: ticket.assignedEmployees.map((emp) => emp.id),
      });
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    form.resetFields();
    onCancel?.();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const assignedEmployeeIds = values.assignedEmployees;
      if (ticket && onSave) {
        onSave(ticket.id, assignedEmployeeIds);
      }
      handleClose();
    } catch (error) {
      console.warn("Validation failed:", error);
    }
  };

  const getPriorityColor = (priorityLevel: number): string =>
    constants?.priorityLevels[priorityLevel.toString()]?.color || "#d9d9d9";

  const getPriorityLabel = (priorityLevel: number): string =>
    constants?.priorityLevels[priorityLevel.toString()]?.label || "unknown";

  const getStatusColor = (status: number): string =>
    constants?.statusTypes[status.toString()]?.color || "default";

  const getStatusLabel = (status: number): string =>
    constants?.statusTypes[status.toString()]?.label || "unknown";

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString();

  if (!ticket) return null;

  return (
    <Modal
      title={
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>
            Ticket Details - {ticket.referenceNumber}
          </span>
          <Button
            type={isEditing ? "default" : "primary"}
            icon={isEditing ? <CloseOutlined /> : <EditOutlined />}
            onClick={handleEditToggle}
            size="small"
            className={styles.modalEditButton}
          >
            {isEditing ? "Cancel" : "Edit Assignment"}
          </Button>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      width={800}
      className={styles.ticketModal}
      footer={
        isEditing ? (
          <>
            <Button onClick={handleEditToggle} className={styles.modalCancelButton}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              className={styles.modalSaveButton}
            >
              Save Assignment
            </Button>
          </>
        ) : (
          <Button onClick={handleClose} className={styles.modalCloseButton}>
            Close
          </Button>
        )
      }
    >
      <div className={styles.modalContent}>
        <Descriptions bordered column={2} size="middle" className={styles.ticketDescriptions}>
          <Descriptions.Item label="Reference Number">
            <Text strong>{ticket.referenceNumber}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Category">
            <Tag>{ticket.category}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={getPriorityColor(ticket.priorityLevel)}>
              {getPriorityLabel(ticket.priorityLevel).toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge
              color={getStatusColor(ticket.status)}
              text={getStatusLabel(ticket.status).replace("_", " ").toUpperCase()}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Location" span={2}>
            <Text>{ticket.location}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Customer Number">
            <Text>{ticket.customerNumber}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Send Updates">
            <Text>{ticket.sendUpdates ? "Yes" : "No"}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Date Created">
            <Text>{formatDate(ticket.dateCreated)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            <Text>{formatDate(ticket.lastUpdated)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            <Text>{ticket.description}</Text>
          </Descriptions.Item>
          {ticket.reasonClosed && (
            <Descriptions.Item label="Reason Closed" span={2}>
              <Text>{ticket.reasonClosed}</Text>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider />

        <div>
          <Title level={5}>Assigned Employees</Title>
          {isEditing ? (
            <Form form={form} layout="vertical">
              <Form.Item
                name="assignedEmployees"
                label="Select Employees"
                help="You can select multiple employees"
              >
                <Select
                  mode="multiple"
                  placeholder="Select employees to assign"
                  showSearch
                  style={{ width: "100%" }}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {employees.map((employee) => (
                    <Option key={employee.id} value={employee.id}>
                      <Space>
                        <Avatar size="small" icon={<UserOutlined />} />
                        {employee.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          ) : (
            <Space wrap>
              {ticket.assignedEmployees.length > 0 ? (
                ticket.assignedEmployees.map((emp) => (
                  <Tag key={emp.id} icon={<UserOutlined />} color="blue">
                    {emp.name}
                  </Tag>
                ))
              ) : (
                <Text italic type="secondary">
                  No employees assigned
                </Text>
              )}
            </Space>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AssignEmployeeModal;
