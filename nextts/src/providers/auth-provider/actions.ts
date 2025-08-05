'use client'
import { createAction } from 'redux-actions';
import { ILogin, IAuthStateContext } from './context';

export enum AuthActionEnums {
    loginUserPending = 'LOGIN_USER_PENDING',
    loginUserSuccess = 'LOGIN_USER_SUCCESS',
    loginUserError = 'LOGIN_USER_ERROR'
}

export const RequestState = {
    Pending: { isPending: true, isSuccess: false, isError: false },
    Success: { isPending: false, isSuccess: true, isError: false },
    Error: { isPending: false, isSuccess: false, isError: true },
};

export const loginUserPending = createAction<IAuthStateContext>(
    AuthActionEnums.loginUserPending, 
    () => RequestState.Pending
);

export const loginUserSuccess = createAction<IAuthStateContext, ILogin>(
    AuthActionEnums.loginUserSuccess,
    (login: ILogin) => (
        {...RequestState.Success,
        login
    })
);

export const loginUserError = createAction<IAuthStateContext>(
    AuthActionEnums.loginUserError,
    () => RequestState.Error
)