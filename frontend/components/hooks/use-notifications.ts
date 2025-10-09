
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '@/server'; 
import { handleAuthRequest } from '../utils/apiRequest'; 
import { setUnreadCount, resetUnreadCount ,setRealTimeNotification } from '@/store/notificationsSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


export interface Notifications { 
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  type: 'like' | 'comment' | 'follow';
  contentId: {
    _id: string;
    image?: { url: string }; 
  };
  isRead: boolean;
  createdAt: string;
}

const useNotifications = () => {
  
  const [notifications, setNotifications] = useState<Notifications[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

   const { user } = useSelector((state: RootState) => state.auth); 

   const realTimeNotification = useSelector((state: RootState) => state.notifications.realTimeNotification);
   const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount); 


   const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    const fetchReq = () => axios.get(`${BASE_API_URL}/notifications`, { withCredentials: true });
    
    const result = await handleAuthRequest(fetchReq, setIsLoading);

    if (result?.data.status === 'success') {
        let data: Notifications[] = result.data.data.notifications;
        let finalNotifications = data;

       
        if (user && user._id) { 
            finalNotifications = data.filter(notification => {
                return notification.sender._id.toString() !== user._id.toString(); 
            });
        }
        
        setNotifications(finalNotifications);
        const count = finalNotifications.filter(n => !n.isRead).length; 
        dispatch(setUnreadCount(count)); 
    }
  
      }, [dispatch, user]); 

      const markAllRead = async () => {
        
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        dispatch(resetUnreadCount()); 
        
        const readReq = () => axios.patch(`${BASE_API_URL}/notifications/read-all`, 
          {}, { withCredentials: true });
        await handleAuthRequest(readReq);
      };

      useEffect(() => {
        fetchNotifications();
      }, [fetchNotifications]);


    useEffect(() => {
     
        if (realTimeNotification) {
            console.log('Real-time update triggered. Refetching notifications...');

            fetchNotifications(); 

            dispatch(setRealTimeNotification(null)); 
        }
        
    }, [realTimeNotification, fetchNotifications, dispatch]);


  return { notifications, isLoading,unreadCount, markAllRead, fetchNotifications };
};

export default useNotifications;