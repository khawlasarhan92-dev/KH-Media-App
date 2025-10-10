
'use client';
import React from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store'; 
import { MessageSquare } from 'lucide-react';
import { createOrOpenChat } from '@/store/chatThunks';
import { fetchAllUsers } from '@/store/userThunks';




const ActiveUsersView: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    
    const { activeUsers } = useSelector((state: RootState) => state.chat);
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
    const users = useSelector((state: RootState) => state.user.users);

    React.useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    if (!users || users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400">
                <MessageSquare className="w-10 h-10 mb-3 text-blue-300" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm">Invite others to join the app.</p>
            </div>
        );
    }

    // استثنِ المستخدم الحالي من القائمة واحتفظ فقط بالمتصلين
    const filteredUsers = users.filter(u => u._id !== currentUserId && Array.isArray(activeUsers)
                           && activeUsers.includes(String(u._id)));


   return (
    <div className="w-full h-full">
        {filteredUsers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">لا يوجد مستخدمين</div>
        ) : (
            <div className="flex flex-col gap-2 h-full items-stretch justify-start">
                {filteredUsers.map((user: Partial<{ _id: string; username: string; profilePicture?: string }>) => {
                    const isOnline = Array.isArray(activeUsers) && activeUsers.includes(String(user._id));
                    const handleStartChat = () => {
                        if (!user._id) return;
                        console.log('[ChatSidebar] Start chat with user:', user._id, 'username:', user.username);
                        dispatch(createOrOpenChat(user._id));
                    };
                  
                    return (
                        <div
                            key={user._id}
                            onClick={handleStartChat}
                            className={`flex flex-row items-center w-full px-3 py-2 cursor-pointer bg-white/80 
                              hover:bg-blue-50 dark:bg-gray-900/70 dark:hover:bg-gray-800 transition rounded-xl
                               group min-h-[64px] border border-transparent hover:border-blue-300 
                               dark:hover:border-cyan-400 shadow-sm overflow-hidden`}
                        >
                            
                            {/* الصورة وحالة الاتصال ) */}
                            <div 
                                className="relative flex-shrink-0 flex items-center justify-center ml-3" 
                                style={{ minWidth: 48, minHeight: 48 }}
                            >
                                {user.profilePicture ? (
                                    <Image 
                                        src={user.profilePicture || '/images/default-avatar.png'} 
                                        alt={user.username || 'avatar'} 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-cyan-400 shadow" 
                                        width={48} 
                                        height={48} 
                                    />
                                ) : (
                                    <div 
                                        className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xl font-bold shadow"
                                    >
                                        {user.username ? user.username[0] : 'U'}
                                    </div>
                                )}
                              
                                <span 
                                    className={`absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full ring-2
                                       ring-white dark:ring-gray-900 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} 
                                    title={isOnline ? 'online' : 'offline'} 
                                />
                            </div>
                          
                            <div className="flex flex-col justify-center min-w-0 flex-grow items-start text-left ml-2"> 
                                <span className="truncate text-base font-semibold text-gray-800 dark:text-gray-100 leading-5">
                                    {user.username}
                                </span>
                                <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'} 
                                    font-medium mt-0.5 leading-4`}>
                                    {isOnline ? 'نشط الآن' : 'غير متصل'}
                                </span>
                            </div>

                            <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-3 flex-shrink-0">
                                الآن
                            </span>

                        </div>
                    ); 
                })}
            </div>
        )}
    </div> 
);
};

export default ActiveUsersView;