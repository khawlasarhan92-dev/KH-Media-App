// Redux slice for authentication state and actions (login, logout, user info, etc.)
import { User } from '@/types';
import {createSlice ,PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  user:User | null;
   isAuthenticated: boolean;
   token: string | null; 
    isLoading: boolean; 
    error: string | null;
}

const initialState:AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action:PayloadAction<User | null>) => {
      state.user = action.payload;
       state.isAuthenticated = !!action.payload;
      state.isLoading = false; 
      state.error = null;
        if (!action.payload) {
          state.token = null;
      }
    },
     setToken: (state, action: PayloadAction<string | null>) => {
        state.token = action.payload;
    },
    
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
   
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false; 
    },
  },
});
export const { setAuthUser, setError, setIsLoading, setToken } = authSlice.actions;
export default authSlice.reducer;

