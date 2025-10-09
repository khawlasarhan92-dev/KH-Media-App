
// ChatListView.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store'; 
import { fetchChats } from '@/store/chatThunks'; 
import { setSelectedChat } from '@/store/chatSlice';



const formatSidebarTime = (timestamp: string | undefined): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const diffInHours = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60);

     const locale = 'en-US';

    if (diffInHours < 24) {
        return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
        return 'Yesterday'; 
    } else {
        return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    }
};


const ChatListView: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const chats = useSelector((state: RootState) => state.chat.chats);
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

 
    useEffect(() => {
        if (chats.length === 0) {
            dispatch(fetchChats()); 
        }
    }, [dispatch, chats.length]);

   
    const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);

    
  

    return (
        <div className="flex flex-col gap-2">
            {chats.map((chat) => {
                const otherMember = chat.members.find(m => m._id !== currentUserId);
                const isActive = selectedChat?._id === chat._id;
                const hasImage = !!otherMember?.profilePicture;
                const avatarText = otherMember?.username ? otherMember.username.charAt(0).toUpperCase() : 'CN';
                return (
                    <div
                        key={chat._id}
                        className={`chat-item-style flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer 
                          transition-colors duration-150 ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        onClick={() => dispatch(setSelectedChat(chat))}
                    >
                        {/* صورة رمزية أو أول حرف */}
                        {hasImage ? (
                            <img
                                src={otherMember.profilePicture}
                                alt={otherMember?.username || 'avatar'}
                                className="w-10 h-10 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary font-bold text-lg border">
                                {avatarText}
                            </div>
                        )}
                        {/* اسم المحادثة والرسالة */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-semibold truncate">{otherMember?.username || chat.chatName}</span>
                            <span className="last-message text-xs text-gray-500 truncate">
                                {chat.latestMessage?.content || 'ابدأ محادثة'}
                            </span>
                        </div>
                        {/* الوقت */}
                        <span className="time-display text-xs text-gray-400 min-w-fit">
                            {formatSidebarTime(chat.latestMessage?.createdAt)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatListView;