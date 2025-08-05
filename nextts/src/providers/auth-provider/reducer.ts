'use client'
import { handleActions } from "redux-actions";
import { INITIAL_STATE, IAuthStateContext } from "./context";
import { AuthActionEnums } from "./actions"; 

export const AuthReducer = handleActions<IAuthStateContext, IAuthStateContext>({

    // loginUser
    [AuthActionEnums.loginUserPending]:(state, action) =>(
        {...state, ...action.payload}),

    [AuthActionEnums.loginUserSuccess]:(state, action) =>(
        {...state, ...action.payload}),

    [AuthActionEnums.loginUserError]:(state, action) =>(
        {...state, ...action.payload})
    
    },INITIAL_STATE)