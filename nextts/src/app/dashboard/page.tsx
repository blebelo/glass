"use client";

import React, { useEffect, useMemo } from "react";
import { Card, Col, Row, Typography, Divider, Tag, Statistic, Button } from "antd";
import { ITicket } from "@/providers/ticket-provider/context";
import { useStyles } from "./style";
import { useTicketState, useTicketActions } from "@/providers/ticket-provider";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const statusLabels: Record<number, string> = {
  0: "Open",
  1: "In Progress",
  2: "Resolved",
};

const statusColors: Record<number, string> = {
  0: "red",
  1: "orange",
  2: "green",
};

const groupTicketsByStatus = (tickets: ITicket[] = []) => {
  return tickets.reduce<Record<number, ITicket[]>>((acc, ticket) => {
    const status = ticket.status ?? 0;
    acc[status] = acc[status] || [];
    acc[status].push(ticket);
    return acc;
  }, {});
};

const calculateAverageResolutionTime = (tickets: ITicket[] = []) => {
  const resolvedTickets = tickets.filter((t) => t.dateClosed);
  if (resolvedTickets.length === 0) return "N/A";

  const totalTime = resolvedTickets.reduce((acc, ticket) => {
    const opened = new Date(ticket.dateCreated).getTime();
    const closed = new Date(ticket.dateClosed!).getTime();
    return acc + (closed - opened);
  }, 0);

  const avgMs = totalTime / resolvedTickets.length;
  const avgDays = avgMs / (1000 * 60 * 60 * 24);
  return `${avgDays.toFixed(1)} days`;
};

const TicketKanban: React.FC = () => {
  const { tickets = [] } = useTicketState();
  const { getTickets } = useTicketActions();
  const { styles } = useStyles();
  const router = useRouter();

  useEffect(() => {
    getTickets();
  }, []);

  const grouped = useMemo(() => groupTicketsByStatus(tickets), [tickets]);
  const avgResolutionTime = useMemo(
    () => calculateAverageResolutionTime(tickets),
    [tickets]
  );


  return (
    <div className={styles.kanbanPage}>

      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => {router.push('/')}}
        className={styles.backButton}
      >
        Back to Home
      </Button>

      <Typography.Title level={2} className={styles.sectionTitle}>
        Ticket Overview
      </Typography.Title>
      <Typography.Paragraph className={styles.sectionSubtitle}>
        A Kanban view of current support tickets grouped by their status.
      </Typography.Paragraph>

      <div className={styles.statsContainer}>
        <Statistic title="Average Resolution Time" value={avgResolutionTime} />
      </div>

      <Divider />

      <Row gutter={16} className={styles.kanbanGrid}>
        {Object.entries(statusLabels).map(([key, label]) => (
          <Col xs={24} md={8} key={key}>
            <Card title={label} className={styles.kanbanColumn}>
              {(grouped[+key] || []).map((ticket) => (
                <Card key={ticket.id} className={styles.ticketCard}>
                  <Typography.Text strong>
                    {ticket.referenceNumber}
                  </Typography.Text>
                  <br />
                  <Typography.Paragraph ellipsis={{ rows: 2 }}>
                    {ticket.description}
                  </Typography.Paragraph>
                  <Tag color={statusColors[ticket.status]}>
                    {statusLabels[ticket.status]}
                  </Tag>
                  <div className={styles.ticketMeta}>
                    Priority: {ticket.priorityLevel} | {ticket.location}
                  </div>
                </Card>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TicketKanban;
