import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface AuthState {
    isAuthenticated: boolean;
    idToken: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    userData: any | null;  
}

interface LoginPayload {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    userData: any;
}

const initialState: AuthState = {
    isAuthenticated: false,
    idToken: null,
    accessToken: null,
    refreshToken: null,
    userData: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<LoginPayload>) {
            state.isAuthenticated = true;
            state.idToken = action.payload.idToken;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken
            state.userData = action.payload.userData;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.idToken = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.userData = null
        },
        setIdToken: (state, action: PayloadAction<string>) => {
            state.idToken = action.payload;
          },
    },
});


export const { loginSuccess, logout,setIdToken  } = authSlice.actions;
const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['isAuthenticated', 'idToken', 'accessToken', 'refreshToken', 'userData'],
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);

export default persistedAuthReducer;
export type { AuthState };
