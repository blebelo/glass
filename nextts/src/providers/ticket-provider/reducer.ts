'use client'
import { handleActions } from "redux-actions";
import { INITIAL_STATE, ITicketStateContext } from "./context";
import { TicketActionEnums } from "./actions";

export const TicketReducer = handleActions<ITicketStateContext, ITicketStateContext>({

    // getTickets
    [TicketActionEnums.getTicketsPending]:(state, action) =>(
        {...state, ...action.payload}),

    [TicketActionEnums.getTicketsSuccess]:(state, action) =>(
        {...state, ...action.payload}),

    [TicketActionEnums.getTicketsError]:(state, action) =>(
        {...state, ...action.payload}),

    // assignEmployee
    [TicketActionEnums.assignEmployeePending]: (state, action) => (
        { ...state, ...action.payload }),

    [TicketActionEnums.assignEmployeeSuccess]: (state, action) => (
        { ...state, ...action.payload }),

    [TicketActionEnums.assignEmployeeError]: (state, action) => (
        { ...state, ...action.payload })
    
    },INITIAL_STATE)