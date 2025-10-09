'use client';
import React, { useState, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store'; 
import { fetchChats } from '@/store/chatThunks';
import ActiveUsersView from './ActiveUsersView'; 
import ChatListView from './ChatListView';      


type SidebarView = 'chats' | 'activeUsers';


const ChatSidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    
  
    const [viewMode, setViewMode] = useState<SidebarView>('chats'); 
    const { chats, isLoading } = useSelector((state: RootState) => state.chat);

    useEffect(() => {
        if (chats.length === 0 && !isLoading) {
             dispatch(fetchChats());
        }
    }, [dispatch, chats.length, isLoading]);

    if (isLoading && viewMode === 'chats' && chats.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Loading chats...
            </div>
        );
    }
    
  
    return (
        <div className="w-full h-full flex flex-col">
            
            {/* أزرار التبديل */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setViewMode('chats')}
                    className={`flex-1 py-3 text-sm font-semibold transition 
                        ${viewMode === 'chats' 
                            ? 'text-blue-600 border-b-2 border-blue-600 dark:text-cyan-400 dark:border-cyan-400' 
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`
                    }
                >
                    chats ({chats.length})
                </button>
                <button
                    onClick={() => setViewMode('activeUsers')}
                    className={`flex-1 py-3 text-sm font-semibold transition 
                        ${viewMode === 'activeUsers' 
                            ? 'text-blue-600 border-b-2 border-blue-600 dark:text-cyan-400 dark:border-cyan-400' 
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`
                    }
                >
                     online
                </button>
            </div>

            {/* عرض المكون بناءً على الوضع المختار */}
            <div className="flex-grow overflow-y-auto">
                {viewMode === 'chats' ? (

                    <ChatListView />
                ) : (
                    <ActiveUsersView />
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;