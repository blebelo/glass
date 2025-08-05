'use client';

import { createContext } from "react";

export interface ILogin {
    userNameOrEmailAddress: string;
    password: string;
}

export interface IAuthStateContext {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    login?: ILogin;
}

export interface IAuthActionContext {
    loginUser : (login : ILogin) => Promise<void>;
}

export const INITIAL_STATE = {
    isPending: false,
    isSuccess: false,
    isError: false
}

export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext | undefined>(undefined);