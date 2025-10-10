// Chat window component for displaying messages and chat interactions
'use client';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchMessages } from '@/store/chatThunks';
import { useSocket } from '../../components/Socket/SocketProvider'; 
import MessageInput from './MessageInput'; 
import { addNewMessage } from '@/store/chatSlice';
import {  ChevronLeft } from 'lucide-react';
import Image from 'next/image';


const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatWindow: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { selectedChat, messages, isLoading, activeUsers } = useSelector((state: RootState) => state.chat);
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
    const { socket } = useSocket();
    
    const messagesEndRef = useRef<HTMLDivElement>(null); 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

   
    useEffect(() => {
        if (selectedChat) {
            dispatch(fetchMessages(selectedChat._id));

            if (socket) {
                socket.emit('join_chat', selectedChat._id);
            }
        }
    }, [selectedChat, dispatch, socket]);

    useEffect(() => {
        if (!socket) return;
        
        const handleNewMessage = (newMessage: any) => {
            if (selectedChat?._id === newMessage.chat) {
                dispatch(addNewMessage(newMessage));
            }
        };

        socket.on('message_received', handleNewMessage);

        return () => {
            socket.off('message_received', handleNewMessage);
        };
    }, [socket, selectedChat, dispatch]);
    
    useEffect(() => {
        if (messages.length > 0) {
             scrollToBottom();
        }
    }, [messages]);

    const chatPartner = selectedChat?.members.find((member: Partial<{ _id: string; username: string; profilePicture?: string }>) => member._id !== currentUserId);
   
    const isPartnerOnline = chatPartner?._id  && Array.isArray(activeUsers) &&
     activeUsers.includes(chatPartner._id) ? true : false;


    if (!selectedChat) {
        return null; 
    }
    
    const isMessageReadByPartner = (msg: any) => {
        if (!chatPartner?._id) return false;
        return msg.readBy && msg.readBy.includes(chatPartner._id);
    };


    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            {selectedChat && chatPartner && (
                <div className="flex items-center gap-4 px-5 py-4 border-b bg-white/80 dark:bg-gray-900/80
                             backdrop-blur-md sticky top-0 z-10 shadow-sm">
                    <button onClick={() => window.history.back()} className="md:hidden p-2 rounded-full hover:bg-blue-100 
                                                                    dark:hover:bg-cyan-900">
                        <ChevronLeft className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                    </button>
                    {/* صورة المستخدم */}
                    {chatPartner?.profilePicture ? (
                        <Image src={chatPartner.profilePicture || '/images/default-avatar.png'} alt={chatPartner.username || 'avatar'} className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-cyan-400 shadow" width={48} height={48} />
                    ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xl font-bold shadow">
                            {chatPartner?.username ? chatPartner.username[0] : 'U'}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-base truncate">
                            {chatPartner.username}
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-medium mt-0.5
                             ${isPartnerOnline ? 'text-green-500' : 'text-gray-400'}`}>
                            <span className={`inline-block w-2 h-2 rounded-full 
                                ${isPartnerOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
                            </span>
                            {isPartnerOnline ? 'active now' : ' offline'}
                        </span>
                    </div>
                </div>
            )}
            {/* Messages */}
            <div className="flex-1 flex flex-col gap-2 px-2 md:px-6 py-4 overflow-y-auto chat-bg-decor rounded-xl">
                {isLoading ? (
                    <div className="text-center text-gray-400 py-8">Loading messages...</div>
                ) : (
                    messages.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">No messages yet</div>
                    ) : (
                        messages.map((msg) => {
                            const isMine = msg.sender?._id === currentUserId;
                            return (
                                <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-md text-sm break-words
                                         ${isMine 
                                            ? 'bg-blue-500 text-white rounded-br-md'
                                            : 'bg-white text-gray-800 rounded-bl-md'} flex flex-col`}>
                                        <span>{msg.content}</span>
                                        <span className="text-[10px] text-gray-300 mt-1 self-end">
                                            {formatMessageTime(msg.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )
                )}
                <div ref={messagesEndRef} />
            </div>
            {/* Message Input */}
            {selectedChat && (
                <div className="px-2 md:px-6 py-3 bg-white/90 backdrop-blur-md border-t shadow-inner">
                    <MessageInput chatId={selectedChat._id} />
                </div>
            )}
        </div>
    );
};
export default ChatWindow;