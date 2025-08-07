import { IEmployee } from "@/providers/employee-provider/context";
import { ITicket } from "@/providers/ticket-provider/context";

export interface ApiResponse<T> {
  result: {
    totalCount: number;
    items: T[];
  };
  targetUrl: string | null;
  success: boolean;
  error: string | null;
  unAuthorizedRequest: boolean;
  __abp: boolean;
}

export interface IPriorityLevel {
  label: string;
  color: string;
}

export interface IStatusType {
  label: string;
  color: string;
}

export interface IConstants {
  priorityLevels: Record<string, IPriorityLevel>;
  statusTypes: Record<string, IStatusType>;
  categories: string[];
}

export interface DashboardData {
  tickets: ApiResponse<ITicket>;
  employees: IEmployee[];
  constants: IConstants;
}