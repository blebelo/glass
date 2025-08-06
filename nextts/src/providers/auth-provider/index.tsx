'use client'
import React, { useContext, useReducer } from "react";
import { AuthReducer } from "./reducer";
import { INITIAL_STATE,AuthStateContext, ILogin, AuthActionContext } from "./context";
import { loginUserError, loginUserPending, loginUserSuccess} from "./actions";
import { axiosInstance } from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { AbpTokenProperies, decodeToken } from "@/utils/jwt";


export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
    const instance = axiosInstance();
    const router = useRouter();

    const loginUser = async (user: ILogin) => {
        dispatch(loginUserPending());
        const endpoint = 'TokenAuth/Authenticate';
        
        console.log(user)
        await instance.post(endpoint, user)
        .then(
            (response) => {
                const token = response.data.result.accessToken;

                if (token == undefined || null)
                    {
                        throw new Error('Token Is Null')
                    }
                const decoded = decodeToken(token);
                const userRole = decoded[AbpTokenProperies.role];
                const userId = decoded[AbpTokenProperies.nameidentifier]

                sessionStorage.setItem("token", token);
                sessionStorage.setItem("role", userRole);
                sessionStorage.setItem("Id", userId );
                console.log(token);
                dispatch(loginUserSuccess(token));
                router.push(`${userRole.toLowerCase()}/dashboard`);
            }
        ).catch(
            (e) => {
                dispatch(loginUserError());
                console.error('Login Failed', e)
            }
        )        
    };

    return (
        <AuthActionContext.Provider value={{loginUser}}>
            <AuthStateContext.Provider value={state}>
                {children}
            </AuthStateContext.Provider>
        </AuthActionContext.Provider>
    )
}


export const useAuthState = () => {
    const context = useContext(AuthStateContext);
    if (!context) {
        throw new Error('useAuthState must be used within a AuthProvider');
    }
    return context;
}

export const useAuthActions = () => {
    const context = useContext(AuthActionContext);
    if (!context) {
        throw new Error('useAuthActions must be used within an AuthProvider');
    }
    return context;
}