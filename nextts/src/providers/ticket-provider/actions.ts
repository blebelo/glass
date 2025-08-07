'use client'
import { createAction } from 'redux-actions';
import { ITicket, ITicketStateContext } from './context';

export enum TicketActionEnums {
    getTicketsPending = 'TICKET_USER_PENDING',
    getTicketsSuccess = 'TICKET_USER_SUCCESS',
    getTicketsError = 'TICKET_USER_ERROR',
    
    assignEmployeePending = 'ASSIGN_EMPLOYEE_PENDING',
    assignEmployeeSuccess = 'ASSIGN_EMPLOYEE_SUCCESS',
    assignEmployeeError = 'ASSIGN_EMPLOYEE_ERROR'
}


export const RequestState = {
    Pending: { isPending: true, isSuccess: false, isError: false },
    Success: { isPending: false, isSuccess: true, isError: false },
    Error: { isPending: false, isSuccess: false, isError: true },
};

export const getTicketsPending = createAction<ITicketStateContext>(
    TicketActionEnums.getTicketsPending, 
    () => RequestState.Pending
);

export const getTicketsSuccess = createAction<ITicketStateContext, ITicket[]>(
    TicketActionEnums.getTicketsSuccess,
    (tickets: ITicket[]) => (
        {...RequestState.Success,
        tickets
    })
);

export const getTicketsError = createAction<ITicketStateContext>(
    TicketActionEnums.getTicketsError,
    () => RequestState.Error
);

export const assignEmployeePending = createAction<ITicketStateContext>(
    TicketActionEnums.assignEmployeePending,
    () => RequestState.Pending
);

export const assignEmployeeSuccess = createAction<ITicketStateContext, ITicket>(
    TicketActionEnums.assignEmployeeSuccess,
    (updatedTicket: ITicket) => ({
        ...RequestState.Success,
        updatedTicket
    })
);

export const assignEmployeeError = createAction<ITicketStateContext>(
    TicketActionEnums.assignEmployeeError,
    () => RequestState.Error
);