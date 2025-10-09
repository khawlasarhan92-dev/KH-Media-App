
// Thunks for chat-related async actions (fetching chats, messages, sending messages, etc.)
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '@/server'; 
import { RootState } from './store'; 
import { setLoading, setChats, setSelectedChat, 
  setMessages, addChat } from './chatSlice';
import { toast } from 'sonner';



// Fetch all chats for the current user
export const fetchChats = createAsyncThunk<void, void, { state: RootState }>(
    'chat/fetchChats',
    async (_, { dispatch, rejectWithValue }) => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get(`${BASE_API_URL}/chats`, {
                withCredentials: true,
            });

            if (response.data.status === 'success') {
                dispatch(setChats(response.data.data.chats));
            }
        } catch (error: any) {
            console.error('Error fetching chats:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch chats.');
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// Create a new chat or open an existing one with a specific user
export const createOrOpenChat = createAsyncThunk<void, string, { state: RootState }>(
    'chat/createOrOpenChat',
    async (userId, { dispatch, getState, rejectWithValue }) => {
        dispatch(setLoading(true));
        const state = getState();
        const existingChat = state.chat.chats.find(chat => 
            chat.members.some(member => member._id === userId) && !chat.isGroupChat
        );

        if (existingChat) {
            dispatch(setSelectedChat(existingChat));
            dispatch(setLoading(false));
            return; 
        }

        try {
            const response = await axios.post(`${BASE_API_URL}/chats`, { userId }, {
                withCredentials: true,
            });

            if (response.data.status === 'success') {
                const newChat = response.data.data.chat;
                dispatch(addChat(newChat));
                dispatch(setSelectedChat(newChat));
            }
        } catch (error: any) {
            console.error('Error creating/opening chat:', error);
            toast.error(error.response?.data?.message || 'Failed to start chat.');
        } finally {
            dispatch(setLoading(false));
        }
    }
);


// Fetch the message history for a specific chat
export const fetchMessages = createAsyncThunk<void, string, { state: RootState }>(
    'chat/fetchMessages',
    async (chatId, { dispatch, rejectWithValue }) => {
        dispatch(setLoading(true));
        try {
            // Fetch messages for a specific chat
            const response = await axios.get(`${BASE_API_URL}/chats/${chatId}/messages`, {
                withCredentials: true,
            });

            if (response.data.status === 'success') {
                dispatch(setMessages(response.data.data.messages));
            }
        } catch (error: any) {
            console.error('Error fetching messages:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch messages.');
        }
    }
);

// Send a new message to a chat
export const sendNewMessage = createAsyncThunk<void, { chatId: string, content: string }, { state: RootState }>(
    'chat/sendNewMessage',
    async ({ chatId, content }, { rejectWithValue }) => {

        try {
            const response = await axios.post(`${BASE_API_URL}/messages`, { chatId, content }, {
                withCredentials: true,
            });

            if (response.data.status === 'success') {
                const message = response.data.data.message;
                return message;

                
    
    
            }
        } catch (error: any) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.message || 'Failed to send message.');
        }
    }
);