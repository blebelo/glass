'use client'
import React, { useContext, useReducer } from "react";
import { INITIAL_STATE,TicketStateContext, TicketActionContext } from "./context";
import {
  getTicketsPending,
  getTicketsSuccess,
  getTicketsError,
  assignEmployeePending,
  assignEmployeeSuccess,
  assignEmployeeError
} from "./actions";
import { axiosInstance } from "@/utils/axiosInstance";
import { TicketReducer } from "./reducer";

export const TicketProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = useReducer(TicketReducer, INITIAL_STATE)
    const instance = axiosInstance();

    const getTickets = async () => {
        dispatch(getTicketsPending());
        const endpoint = 'services/app/Ticket/GetAll';
        
        await instance.get(endpoint)
        .then(
            (response) => {
                dispatch(getTicketsSuccess(response.data.result.items));
            }
        ).catch(
            () => {
                dispatch(getTicketsError());
            }
        )        
    };

    const assignEmployee = async (ticketId: string , employeeIds: string[]) => {
        dispatch(assignEmployeePending());
        const endpoint = `services/app/Ticket/AssignEmployees/?ticket=${ticketId}`

        await instance.post(endpoint, employeeIds)
        .then(
            (response) => {
                dispatch(assignEmployeeSuccess(response.data.result));
            }
        ).catch(
            () => {
                dispatch(assignEmployeeError());
            }
        )
    };

    return (
        <TicketActionContext.Provider value={{getTickets, assignEmployee}}>
            <TicketStateContext.Provider value={state}>
                {children}
            </TicketStateContext.Provider>
        </TicketActionContext.Provider>
    )
}

export const useTicketState = () => {
    const context = useContext(TicketStateContext);
    if (!context) {
        throw new Error('useTicketState must be used within a TicketProvider');
    }
    return context;
}

export const useTicketActions = () => {
    const context = useContext(TicketActionContext);
    if (!context) {
        throw new Error('useTicketActions must be used within an TicketProvider');
    }
    return context;
}