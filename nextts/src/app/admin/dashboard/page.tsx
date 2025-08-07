"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Table,
  Button,
  Select,
  Input,
  Typography,
  Row,
  Col,
  Statistic,
  Badge,
  Avatar,
  Progress,
  Space,
  Tag,
  Menu,
} from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  HeartOutlined,
  BarChartOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ArrowUpOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { useStyles } from "./style";
import { IConstants } from "./types";
import { useRouter } from "next/navigation";
import { useTicketActions, useTicketState } from "@/providers/ticket-provider";
import AssignEmployeeModal from "../../../components/modals/ticketModals/AssignEmployeeModal";
import { ITicket } from "@/providers/ticket-provider/context";
import { IEmployee } from "@/providers/employee-provider/context";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const SupervisorDashboard: React.FC = () => {
  const { styles } = useStyles();
  const [selectedTab, setSelectedTab] = useState<string>("dashboard");
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [constants, setConstants] = useState<IConstants | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [filteredTickets, setFilteredTickets] = useState<ITicket[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);

  const router = useRouter();
  const ticketData = useTicketState();
  const ticketActions = useTicketActions();
  const tickets = ticketData.tickets;


  useEffect(() => {
    const defaultConstants: IConstants = {
      priorityLevels: {
        "1": { label: "Low", color: "#52c41a" },
        "2": { label: "Medium", color: "#faad14" },
        "3": { label: "High", color: "#fa8c16" },
        "4": { label: "Critical", color: "#f5222d" }
      },
      statusTypes: {
        "0": { label: "Open", color: "blue" },
        "1": { label: "In Progress", color: "orange" },
        "2": { label: "Resolved", color: "green" }
      },
      categories: ["Technical", "Maintenance", "Request", "Incident"]
    };
    
    setConstants(defaultConstants);
  }, []);

  useEffect(() => {
    ticketActions.getTickets();
    setEmployees([]);
  }, [ticketData]);


  useEffect(() => {
    if (!tickets) {
      setFilteredTickets([]);
      return;
    }

    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.status.toString() === statusFilter
      );
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.priorityLevel.toString() === priorityFilter
      );
    }

    if (assigneeFilter !== "all") {
      filtered = filtered.filter((ticket) =>
        ticket.assignedEmployees.some((emp) => emp.name === assigneeFilter)
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter, assigneeFilter]);

  const getPriorityColor = (priorityLevel: number): string => {
    if (!constants) return "#d9d9d9";
    return constants.priorityLevels[priorityLevel.toString()]?.color || "#d9d9d9";
  };

  const getPriorityLabel = (priorityLevel: number): string => {
    if (!constants) return "Unknown";
    return constants.priorityLevels[priorityLevel.toString()]?.label || "Unknown";
  };

  const getStatusColor = (status: number): string => {
    if (!constants) return "default";
    return constants.statusTypes[status.toString()]?.color || "default";
  };

  const getStatusLabel = (status: number): string => {
    if (!constants) return "Unknown";
    return constants.statusTypes[status.toString()]?.label || "Unknown";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  const handleViewTicket = (ticket: ITicket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const ticketColumns = [
    {
      title: "Reference",
      dataIndex: "referenceNumber",
      key: "referenceNumber",
      render: (ref: string) => (
        <Text strong className={styles.ticketIdText}>
          {ref}
        </Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <Text className={styles.ticketTitleText}>{description}</Text>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priorityLevel",
      key: "priorityLevel",
      render: (priority: number) => (
        <Tag color={getPriorityColor(priority)} className={styles.priorityTag}>
          {getPriorityLabel(priority).toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <Badge
          color={getStatusColor(status)}
          text={getStatusLabel(status).replace("_", " ").toUpperCase()}
          className={styles.statusBadge}
        />
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => (
        <Tag className={styles.categoryTag}>{category}</Tag>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location: string) => <Text type="secondary">{location}</Text>,
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Text type="secondary">{formatDate(date)}</Text>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (date: string) => (
        <Text type="secondary">{formatDate(date)}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: ITicket) => (
        <Button onClick={() => handleViewTicket(record)}>
          View
        </Button>
      ),
    },
  ];

  const getStatusCounts = () => {
    if (!tickets) {
      return { open: 0, inProgress: 0, resolved: 0 };
    }

    return {
      open: tickets.filter((t) => t.status === 0).length,
      inProgress: tickets.filter((t) => t.status === 1).length,
      resolved: tickets.filter((t) => t.status === 2).length,
    };
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "tickets",
      icon: <HeartOutlined />,
      label: "Tickets",
    },
    {
      key: "team",
      icon: <TeamOutlined />,
      label: "Team",
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
    },
  ];

  const statusCounts = getStatusCounts();

  const renderDashboard = () => (
    <div className={styles.pageContainer}>
      {/* Stats Cards */}
      <Row gutter={[24, 24]} className={styles.cardMargin}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.gradientCard}>
            <Statistic
              title={
                <span className={styles.statisticTitle}>Total Tickets</span>
              }
              value={tickets?.length || 0}
              prefix={<HeartOutlined className={styles.whiteIcon} />}
              valueStyle={{
                color: "white",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.regularCard}>
            <Statistic
              title="Open Tickets"
              value={statusCounts.open}
              prefix={<ExclamationCircleOutlined className={styles.blueIcon} />}
              valueStyle={{
                color: "#1890ff",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.regularCard}>
            <Statistic
              title="In Progress"
              value={statusCounts.inProgress}
              prefix={<SyncOutlined className={styles.yellowIcon} />}
              valueStyle={{
                color: "#faad14",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.regularCard}>
            <Statistic
              title="Resolved Today"
              value={statusCounts.resolved}
              prefix={<CheckCircleOutlined className={styles.greenIcon} />}
              valueStyle={{
                color: "#52c41a",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
              suffix={<ArrowUpOutlined className={styles.greenSmallIcon} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions & Team Performance */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title="Recent Tickets"
            className={styles.roundedCard}
            extra={
              <Button
                type="primary"
                className={styles.filterInput}
                onClick={() => setSelectedTab("tickets")}
              >
                View All
              </Button>
            }
          >
            <Table
              dataSource={tickets ? tickets.slice(0, 5) : []}
              columns={ticketColumns.slice(0, 6)}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Team Performance" className={styles.roundedCard}>
            {employees.length === 0 ? (
              <Text type="secondary">No Employees Found</Text>
            ) : (
              employees.slice(0, 3).map((employee) => (
                <div key={employee.id} className={styles.teamMemberContainer}>
                  <Space className={styles.teamMemberSpace}>
                    <Space>
                      <Avatar icon={<UserOutlined />} />
                      <div>
                        <Text strong>{employee.name}</Text>
                        <br />
                        <Text type="secondary" className={styles.teamMemberInfo}>
                          {employee.ticketsAssigned.length || 0} active tickets
                        </Text>
                      </div>
                    </Space>
                  </Space>
                </div>
              ))
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderTickets = () => (
    <div className={styles.pageContainer}>
      <Card className={`${styles.roundedCard} ${styles.sectionMargin}`}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search tickets..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.filterInput}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className={styles.filterSelect}
              placeholder="Status"
            >
              <Option value="all">All Status</Option>
              <Option value="0">Open</Option>
              <Option value="1">In Progress</Option>
              <Option value="2">Resolved</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              className={styles.filterSelect}
              placeholder="Priority"
            >
              <Option value="all">All Priority</Option>
              <Option value="4">Critical</Option>
              <Option value="3">High</Option>
              <Option value="2">Medium</Option>
              <Option value="1">Low</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              value={assigneeFilter}
              onChange={setAssigneeFilter}
              className={styles.filterSelect}
              placeholder="Assignee"
              disabled={employees.length === 0}
            >
              <Option value="all">All Assignees</Option>
              {employees.map((emp) => (
                <Option key={emp.id} value={emp.name}>
                  {emp.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={2}>
            <Button 
              icon={<FilterOutlined />} 
              className={styles.filterButton}
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
                setAssigneeFilter("all");
              }}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className={styles.roundedCard}>
        <Table
          dataSource={filteredTickets}
          columns={ticketColumns}
          pagination={{
            total: filteredTickets.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            style: { marginTop: "24px" },
          }}
          rowKey="id"
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );

  const renderTeam = () => (
    <div className={styles.pageContainer}>
      <Row gutter={[24, 24]}>
        {employees.length === 0 ? (
          <Col xs={24}>
            <Card className={styles.roundedCard}>
              <Text type="secondary">
                Team data will be available when employee provider is implemented
              </Text>
            </Card>
          </Col>
        ) : (
          employees.map((employee) => (
            <Col xs={24} sm={12} lg={6} key={employee.id}>
              <Card className={styles.teamCard}>
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className={styles.teamCardAvatar}
                />
                <Title level={4} className={styles.teamCardTitle}>
                  {employee.name}
                </Title>

                <Row gutter={[8, 8]} className={styles.teamCardStats}>
                  <Col span={12}>
                    <Statistic
                      title="Open"
                      value={employee.ticketsAssigned.filter(t => t.status !== 2).length || 0}
                      valueStyle={{ fontSize: "18px", color: "#1890ff" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Resolved"
                      value={employee.ticketsAssigned.filter(t => t.status == 2).length || 0}
                      valueStyle={{ fontSize: "18px", color: "#52c41a" }}
                    />
                  </Col>
                </Row>

                <div className={styles.teamCardPerformance}>
                  <Text
                    type="secondary"
                    className={styles.teamCardPerformanceText}
                  >
                    Performance Score
                  </Text>
                  <Progress
                    percent={100}
                    strokeColor="#667eea"
                    className={styles.teamCardProgress}
                  />
                </div>

                <div className={styles.teamCardResolution}>
                  <Text
                    type="secondary"
                    className={styles.teamCardResolutionText}
                  >
                    Avg Resolution: {"N/A"}
                  </Text>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );

  const renderAnalytics = () => (
    <div className={styles.pageContainer}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Ticket Trends" className={styles.roundedCard}>
            <div className={styles.analyticsChart}>
              <Text type="secondary">Chart visualization would go here</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Resolution Time" className={styles.roundedCard}>
            <div className={styles.analyticsChart}>
              <Text type="secondary">Time analysis chart would go here</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className={styles.rowMargin}>
        <Col xs={24}>
          <Card title="Department Analytics" className={styles.roundedCard}>
            <Row gutter={[24, 24]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Avg Resolution Time"
                  value={2.4}
                  suffix="hours"
                  valueStyle={{ color: "#667eea" }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="First Response Time"
                  value={15}
                  suffix="min"
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Customer Satisfaction"
                  value={94}
                  suffix="%"
                  valueStyle={{ color: "#faad14" }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="SLA Compliance"
                  value={98}
                  suffix="%"
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return renderDashboard();
      case "tickets":
        return renderTickets();
      case "team":
        return renderTeam();
      case "analytics":
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.headerTitle}>
          <span style={{ fontSize: "24px", marginRight: "12px" }}>🤖</span>
          <Title level={3} className={styles.headerTitleText}>
            Glass - Supervisor Dashboard
          </Title>
        </div>
        <div onClick={handleLogout} style={{ cursor: "pointer" }}>
          <Space>
            <Avatar icon={<LogoutOutlined />} />
            <Text className={styles.headerUserText}>Logout</Text>
          </Space>
        </div>
      </Header>

      <Layout>
        <Sider width={250} className={styles.sider}>
          <Menu
            mode="inline"
            selectedKeys={[selectedTab]}
            onClick={({ key }) => setSelectedTab(key)}
            className={styles.menu}
            items={menuItems.map((item) => ({
              ...item,
              className: styles.menuItem,
            }))}
          />
        </Sider>

        <Content className={styles.content}>
          {renderContent()}
        </Content>
      </Layout>

      {/* Modal */}
      {showModal && selectedTicket && constants && (
        <AssignEmployeeModal
          visible={showModal}
          ticket={selectedTicket}
          employees={employees}
          constants={constants}
          onSave={ticketActions.assignEmployee}
          onCancel={() => setShowModal(false)}
        />
      )}
    </Layout>
  );
};

export default SupervisorDashboard;