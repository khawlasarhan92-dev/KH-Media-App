// Redux slice for managing notifications and unread count

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
 

interface NotificationsState {
    unreadCount: number;
    realTimeNotification: any | null; 
}

const initialState: NotificationsState = {
    unreadCount: 0,
    realTimeNotification: null,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
     
        incrementUnreadCount: (state) => {
            state.unreadCount += 1;
        },   
      
        setUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload;
        },
        
   
        setRealTimeNotification: (state, action: PayloadAction<any | null>) => {
            state.realTimeNotification = action.payload;
        },
    
        resetUnreadCount: (state) => {
            state.unreadCount = 0;
        },
       
    },
});

export const { 
    incrementUnreadCount, 
    setUnreadCount, 
    setRealTimeNotification,
    resetUnreadCount,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;