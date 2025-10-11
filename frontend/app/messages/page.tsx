'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchChats } from '@/store/chatThunks';
import ChatSidebar from '../../components/Chat/ChatSidebar';
import ChatWindow from '../../components/Chat/ChatWindow';
import ChatListView from '../../components/Chat/ChatListView';
import { useState } from 'react';
import type { Chat } from '@/store/chatSlice';
import { setSelectedChat } from '@/store/chatSlice';


const MessagesPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedChat, isLoading } = useSelector((state: RootState) => state.chat);

    useEffect(() => {
        dispatch(fetchChats());
    }, [dispatch]);

    const [showChatWindow, setShowChatWindow] = useState(false);

    // عند اختيار محادثة من القائمة
    const handleSelectChat = (chat: Chat) => {
        dispatch(setSelectedChat(chat));
        setShowChatWindow(true);
    };

    // زر الرجوع
    const handleBack = () => {
        setShowChatWindow(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br
         from-blue-100 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
         transition-colors duration-500">
            <div className="main-container w-full h-[92vh] flex rounded-none md:rounded-3xl 
            shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 backdrop-blur-xl px-0 md:px-4">
                {/* للجوال فقط */}
                <div className="block md:hidden w-full h-full">
                    {/* الهيدر وزر التبديل */}
                    {!showChatWindow && (
                        <div className="p-4 border-b border-gray-100 bg-white/90 flex items-center justify-between shadow-sm">
                            <button className="p-2 rounded-full bg-blue-100 text-blue-600 font-bold" disabled>List</button>
                            <h1 className="text-xl font-extrabold text-blue-700 tracking-tight">Chats</h1>
                            <span className="w-8"></span>
                        </div>
                    )}
                    {!showChatWindow && (
                        <div className="w-full flex-1 overflow-y-auto">
                            <ChatListView onSelectChat={handleSelectChat} />
                        </div>
                    )}
                    {showChatWindow && (
                        <div className="w-full flex-1 overflow-y-auto">
                            <ChatWindow onBack={handleBack} />
                        </div>
                    )}
                </div>
                <div className="hidden md:flex w-full h-full">
                    {/* الشات سايدبار */}
                    <aside className={`w-72 md:w-80 border-r border-gray-100 dark:border-gray-800 
                        flex-shrink-0 bg-white/80 dark:bg-gray-900/80 h-full flex flex-col
                         ${selectedChat ? 'hidden md:flex' : 'flex'} transition-all duration-300`}>
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800 sticky top-0
                         bg-white/90 dark:bg-gray-900/90 z-10 flex-shrink-0 flex items-center justify-center shadow-sm">
                            <h1 className="text-2xl font-extrabold text-blue-700 dark:text-cyan-400 tracking-tight
                             drop-shadow-sm">Chats</h1>
                        </div>
                        {isLoading ? (
                            <p className="p-4 text-center text-gray-400 flex-shrink-0">Loading chats...</p>
                        ) : (
                            <div className="flex-1 overflow-y-auto chat-scrollbar scrollbar-thin 
                            scrollbar-thumb-blue-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent p-2">
                                <ChatSidebar />
                            </div>
                        )}
                    </aside>
                    {/* نافذة المحادثة الرئيسية */}
                    <main className={`flex-1 flex flex-col h-full bg-gradient-to-br from-white 
                        via-blue-50 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                         ${selectedChat ? 'block' : 'hidden md:flex'}
                          border-l border-gray-100 dark:border-gray-800 transition-all duration-300`}>
                        {selectedChat ? (
                            <div className="flex-1 flex flex-col chat-scrollbar overflow-y-auto 
                            scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-gray-700
                             scrollbar-track-transparent px-0 md:px-6 py-2">
                                <ChatWindow />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full
                             text-gray-400 text-center p-8 md:block">
                                <svg className="w-16 h-16 text-blue-200 mb-4" 
                                fill="none" strokeLinecap="round" 
                                strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                </svg>
                                <span className="text-lg font-semibold">  Select a chat to start messaging </span>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;