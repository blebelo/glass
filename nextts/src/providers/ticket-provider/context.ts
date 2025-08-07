'use client';

import { createContext } from "react";
import { IEmployee } from "../employee-provider/context";

export interface ITicket {
  id: string
  referenceNumber: string;
  priorityLevel: number;
  location: string;
  status: number;
  category: string;
  description: string;
  dateCreated: string;
  lastUpdated: string;
  dateClosed: string | null;
  reasonClosed: string | null;
  sendUpdates: boolean;
  customerNumber: string;
  assignedEmployees: IEmployee[]
}

export interface ITicketStateContext {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    ticket?: ITicket
    tickets?: ITicket[]
}

export interface ITicketActionContext {
    getTickets: () => Promise<void>;
    assignEmployee: (ticketId: string, employeeIds: string[]) => Promise<void>; 
}

export const INITIAL_STATE = {
    isPending: false,
    isSuccess: false,
    isError: false
}

export const TicketStateContext = createContext<ITicketStateContext>(INITIAL_STATE);
export const TicketActionContext = createContext<ITicketActionContext | undefined>(undefined);