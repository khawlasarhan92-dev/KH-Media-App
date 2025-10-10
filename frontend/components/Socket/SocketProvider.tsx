// SocketProvider: Provides a Socket.IO context for real-time chat and notifications across the app.
'use client';

import React, {
    createContext, useContext,
    useState, useEffect, ReactNode
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import store, { AppDispatch, RootState } from '@/store/store';
import { addNewMessage, setActiveUsers , Message } from '@/store/chatSlice';
import { setRealTimeNotification} from '@/store/notificationsSlice';
import { fetchChats } from '../../store/chatThunks';
import { Notifications } from '../hooks/use-notifications';




const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});


export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {

   const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let newSocket: Socket | null = null;

        // عند تغيير المستخدم أو تسجيل الخروج، افصل السوكيت القديم فورًا
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }

        if (!isAuthenticated || !token) {
            dispatch(setActiveUsers([] as string[])); 
            return;
        }

        //  إنشاء الاتصال
        newSocket = io(SOCKET_URL, {
            withCredentials: true,
            query: {
                token: token,
            },
        });

        setSocket(newSocket);

        //  معالجة الأحداث الأساسية
        newSocket.on('connect', () => {
            setIsConnected(true);
            dispatch(fetchChats()); 
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            dispatch(setActiveUsers([] as string[]));
        });

        const handleActiveUsers = (users: string[]) => {
            console.log('Received activeUsers from socket:', users);
            dispatch(setActiveUsers(users)); 
        };
        newSocket.on('activeUsers', handleActiveUsers);

        //(NEW MESSAGE LISTENER)
        const handleMessageReceived = (message: Message) => {

             if (!message || !message.chat) {
                console.warn('Received invalid message object:', message);
                return;
            }

            const senderId = (typeof message.sender === 'object' && message.sender !== null)
                ? message.sender._id
                : message.sender;

        
            if (user?._id === senderId) {
                return;
            }

            const currentState = store.getState() as RootState;
            const currentChat = currentState.chat.selectedChat;

            const isForSelectedChat = currentChat?._id === message.chat;

            if (isForSelectedChat) {
                dispatch(addNewMessage(message));
            }
            
        };
        newSocket.on('message_received', handleMessageReceived);

         const handleChatUpdated = (chatId: string) => {

            dispatch(fetchChats()); 
    };
    newSocket.on('chat_updated', handleChatUpdated);


        // (NEW NOTIFICATIONS LISTENER)
        const handleNewNotification = (data: Notifications) => {

             const senderId = data.sender._id || data.sender; 

      if (user?._id === senderId) { 
          return; 
      }
            dispatch(setRealTimeNotification(data));

        };
        newSocket.on('newNotification', handleNewNotification);


        return () => {
            newSocket?.off('message_received', handleMessageReceived);
            newSocket?.off('activeUsers', handleActiveUsers); 
            newSocket?.off('newNotification', handleNewNotification); 
            newSocket?.off('chat_updated', handleChatUpdated); 
            newSocket?.disconnect();
        };

       
    }, [isAuthenticated, token, dispatch, user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};