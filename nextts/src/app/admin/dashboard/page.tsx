'use client';

import React, { useState, useEffect } from 'react';
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
  Dropdown,
  Space,
  Tag,
  Menu
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  HeartOutlined,
  BarChartOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ArrowUpOutlined,
  
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const mockTickets = [
  {
    id: 'T-001',
    title: 'Login Issues with Mobile App',
    priority: 'high',
    status: 'open',
    assignee: 'John Smith',
    category: 'Technical',
    created: '2024-08-01',
    updated: '2024-08-03',
    department: 'IT Support'
  },
  {
    id: 'T-002',
    title: 'Password Reset Request',
    priority: 'medium',
    status: 'in_progress',
    assignee: 'Sarah Johnson',
    category: 'Account',
    created: '2024-08-02',
    updated: '2024-08-04',
    department: 'IT Support'
  },
  {
    id: 'T-003',
    title: 'Server Performance Issues',
    priority: 'critical',
    status: 'escalated',
    assignee: 'Mike Wilson',
    category: 'Infrastructure',
    created: '2024-08-01',
    updated: '2024-08-04',
    department: 'IT Support'
  },
  {
    id: 'T-004',
    title: 'Email Configuration Help',
    priority: 'low',
    status: 'resolved',
    assignee: 'Emily Davis',
    category: 'Technical',
    created: '2024-07-30',
    updated: '2024-08-03',
    department: 'IT Support'
  },
  {
    id: 'T-005',
    title: 'Database Backup Failed',
    priority: 'high',
    status: 'open',
    assignee: 'John Smith',
    category: 'Infrastructure',
    created: '2024-08-03',
    updated: '2024-08-04',
    department: 'IT Support'
  }
];

const mockEmployees = [
  {
    id: 1,
    name: 'John Smith',
    avatar: '/api/placeholder/32/32',
    activeTickets: 8,
    resolvedToday: 3,
    avgResolutionTime: '2.3h',
    performance: 92
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/32/32',
    activeTickets: 5,
    resolvedToday: 7,
    avgResolutionTime: '1.8h',
    performance: 96
  },
  {
    id: 3,
    name: 'Mike Wilson',
    avatar: '/api/placeholder/32/32',
    activeTickets: 12,
    resolvedToday: 2,
    avgResolutionTime: '3.1h',
    performance: 88
  },
  {
    id: 4,
    name: 'Emily Davis',
    avatar: '/api/placeholder/32/32',
    activeTickets: 6,
    resolvedToday: 4,
    avgResolutionTime: '2.1h',
    performance: 94
  }
];

const SupervisorDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [tickets] = useState(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  // Filter tickets based on search and filters
  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.assignee === assigneeFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter, assigneeFilter]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ff4d4f';
      case 'high': return '#ff7a45';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'blue';
      case 'in_progress': return 'orange';
      case 'escalated': return 'red';
      case 'resolved': return 'green';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <ExclamationCircleOutlined />;
      case 'in_progress': return <SyncOutlined spin />;
      case 'escalated': return <ArrowUpOutlined />;
      case 'resolved': return <CheckCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const ticketColumns = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong style={{ color: '#667eea' }}>{id}</Text>
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <Text style={{ color: '#2c3e50' }}>{title}</Text>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)} style={{ borderRadius: '12px', fontWeight: 600 }}>
          {priority.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          color={getStatusColor(status)} 
          text={status.replace('_', ' ').toUpperCase()}
          style={{ fontWeight: 500 }}
        />
      )
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (assignee: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{assignee}</Text>
        </Space>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag style={{ borderRadius: '8px' }}>{category}</Tag>
    },
    {
      title: 'Updated',
      dataIndex: 'updated',
      key: 'updated',
      render: (date: string) => <Text type="secondary">{date}</Text>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1">View Details</Menu.Item>
              <Menu.Item key="2">Reassign</Menu.Item>
              <Menu.Item key="3">Update Status</Menu.Item>
              <Menu.Item key="4">Add Comment</Menu.Item>
            </Menu>
          }
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      )
    }
  ];

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: 'tickets',
      icon: <HeartOutlined />,
      label: 'Tickets'
    },
    {
      key: 'team',
      icon: <TeamOutlined />,
      label: 'Team'
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics'
    }
  ];

  const renderDashboard = () => (
    <div style={{ padding: '24px' }}>
      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            color: 'white'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Total Tickets</span>}
              value={tickets.length}
              prefix={<HeartOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '16px', border: '1px solid #f0f0f0' }}>
            <Statistic
              title="Open Tickets"
              value={tickets.filter(t => t.status === 'open').length}
              prefix={<ExclamationCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '16px', border: '1px solid #f0f0f0' }}>
            <Statistic
              title="In Progress"
              value={tickets.filter(t => t.status === 'in_progress').length}
              prefix={<SyncOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontSize: '2rem', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '16px', border: '1px solid #f0f0f0' }}>
            <Statistic
              title="Resolved Today"
              value={12}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '2rem', fontWeight: 'bold' }}
              suffix={<ArrowUpOutlined style={{ color: '#52c41a', fontSize: '14px' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions & Team Performance */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Tickets" 
            style={{ borderRadius: '16px' }}
            extra={<Button type="primary" style={{ borderRadius: '8px' }}>View All</Button>}
          >
            <Table
              dataSource={filteredTickets.slice(0, 5)}
              columns={ticketColumns.slice(0, 5)}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Team Performance" style={{ borderRadius: '16px', marginBottom: '24px' }}>
            {mockEmployees.slice(0, 3).map(employee => (
              <div key={employee.id} style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                      <Text strong>{employee.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {employee.activeTickets} active tickets
                      </Text>
                    </div>
                  </Space>
                  <div style={{ textAlign: 'right' }}>
                    <Progress 
                      type="circle" 
                      size={40} 
                      percent={employee.performance}
                      format={percent => `${percent}%`}
                      strokeColor="#667eea"
                    />
                  </div>
                </Space>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderTickets = () => (
    <div style={{ padding: '24px' }}>
      <Card style={{ borderRadius: '16px', marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search tickets..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%', borderRadius: '8px' }}
              placeholder="Status"
            >
              <Option value="all">All Status</Option>
              <Option value="open">Open</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="escalated">Escalated</Option>
              <Option value="resolved">Resolved</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: '100%' }}
              placeholder="Priority"
            >
              <Option value="all">All Priority</Option>
              <Option value="critical">Critical</Option>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              value={assigneeFilter}
              onChange={setAssigneeFilter}
              style={{ width: '100%' }}
              placeholder="Assignee"
            >
              <Option value="all">All Assignees</Option>
              {mockEmployees.map(emp => (
                <Option key={emp.id} value={emp.name}>{emp.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={2}>
            <Button 
              icon={<FilterOutlined />} 
              style={{ width: '100%', borderRadius: '8px' }}
            >
              Filter
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: '16px' }}>
        <Table
          dataSource={filteredTickets}
          columns={ticketColumns}
          pagination={{
            total: filteredTickets.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            style: { marginTop: '24px' }
          }}
          rowKey="id"
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );

  const renderTeam = () => (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {mockEmployees.map(employee => (
          <Col xs={24} sm={12} lg={6} key={employee.id}>
            <Card style={{ borderRadius: '16px', textAlign: 'center' }}>
              <Avatar size={64} icon={<UserOutlined />} style={{ marginBottom: '16px' }} />
              <Title level={4} style={{ margin: '8px 0', color: '#2c3e50' }}>{employee.name}</Title>
              
              <Row gutter={[8, 8]} style={{ marginTop: '16px' }}>
                <Col span={12}>
                  <Statistic
                    title="Active"
                    value={employee.activeTickets}
                    valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Resolved"
                    value={employee.resolvedToday}
                    valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                  />
                </Col>
              </Row>
              
              <div style={{ marginTop: '16px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Performance Score</Text>
                <Progress 
                  percent={employee.performance} 
                  strokeColor="#667eea"
                  style={{ margin: '8px 0' }}
                />
              </div>
              
              <div style={{ marginTop: '12px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Avg Resolution: {employee.avgResolutionTime}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Ticket Trends" style={{ borderRadius: '16px' }}>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: '8px' }}>
              <Text type="secondary">Chart visualization would go here</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Resolution Time" style={{ borderRadius: '16px' }}>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: '8px' }}>
              <Text type="secondary">Time analysis chart would go here</Text>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card title="Department Analytics" style={{ borderRadius: '16px' }}>
            <Row gutter={[24, 24]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Avg Resolution Time"
                  value={2.4}
                  suffix="hours"
                  valueStyle={{ color: '#667eea' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="First Response Time"
                  value={15}
                  suffix="min"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Customer Satisfaction"
                  value={94}
                  suffix="%"
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="SLA Compliance"
                  value={98}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
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
      case 'dashboard': return renderDashboard();
      case 'tickets': return renderTickets();
      case 'team': return renderTeam();
      case 'analytics': return renderAnalytics();
      default: return renderDashboard();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header style={{ 
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '12px' }}>🤖</span>
          <Title level={3} style={{ color: 'white', margin: 0 }}>Glass - Supervisor Dashboard</Title>
        </div>
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text style={{ color: 'white' }}>Sarah Wilson</Text>
        </Space>
      </Header>
      
      <Layout>
        <Sider 
          width={250} 
          style={{ 
            background: 'white',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedTab]}
            onClick={({ key }) => setSelectedTab(key)}
            style={{ border: 'none', padding: '16px 8px' }}
            items={menuItems.map(item => ({
              ...item,
              style: { 
                borderRadius: '8px', 
                margin: '4px 0',
                height: '48px',
                display: 'flex',
                alignItems: 'center'
              }
            }))}
          />
        </Sider>
        
        <Content style={{ background: '#f5f7fa' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SupervisorDashboard;