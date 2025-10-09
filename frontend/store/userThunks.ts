// Thunks for user-related async actions (follow/unfollow, profile updates, etc.)


import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '@/server'; 
import { setAuthUser, setError, setIsLoading } from './authSlice'; 
import { setUsers } from "./userSlice"
import { RootState } from './store'; 
import { User } from '@/types';


export const followUnfollowUser = createAsyncThunk<
  void, 
  string, 
  { state: RootState; rejectValue: string }
> (
  'user/followUnfollow',
  async (userId, { getState, dispatch, rejectWithValue }) => {
    dispatch(setIsLoading(true)); 

    try {
      const state = getState();
      const currentUser = state.auth.user;

      if (!currentUser) {
        dispatch(setError('User is not authenticated.'));
        return rejectWithValue('User is not authenticated.');
      }

      const isCurrentlyFollowing = currentUser.following.includes(userId);
      
      let response;
      if (isCurrentlyFollowing) {
        response = await axios.delete(`${BASE_API_URL}/users/follow/${userId}`, {
          withCredentials: true,
        });
      } else {
      
        response = await axios.post(`${BASE_API_URL}/users/follow/${userId}`, {}, {
          withCredentials: true,
        });
      }

      let newFollowing;
      if (isCurrentlyFollowing) {

        newFollowing = currentUser.following.filter(id => id !== userId);
      } else {
     
        newFollowing = [...currentUser.following, userId];
      }

      const updatedUser: User = {
        ...currentUser,
        following: newFollowing,
      };

    
      dispatch(setAuthUser(updatedUser)); 

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update follow status.';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setIsLoading(false)); 
    }
  }
);


export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/users/suggested-user`, { withCredentials: true });
      if (response.data.status === 'success') {
        dispatch(setUsers(response.data.data.users));
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users.');
    }
  }
);