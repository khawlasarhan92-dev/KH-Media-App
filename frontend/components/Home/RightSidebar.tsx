'use client'
import { BASE_API_URL } from '@/server';
import { RootState } from '@/store/store';
import { User } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React,{useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { handleAuthRequest } from '../utils/apiRequest';
import { Loader, RefreshCw, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

const RightSidebar = () => {
    // جلب البيانات من Redux
    const user = useSelector((state:RootState)=> state.auth.user);
    const [suggestedUser, setSuggestedUser] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

   
    const fetchSuggested = async () => {
        const getSuggestedUserReq = async () =>
            await axios.get(`${BASE_API_URL}/users/suggested-user`, { withCredentials: true });
        const result = await handleAuthRequest(getSuggestedUserReq, setIsLoading);
        if (result) {
            setSuggestedUser(result.data.data.users);
        }
    };
    useEffect(() => {
        fetchSuggested();
    }, []);

    if(isLoading){
        return (
            <div className='w-full h-full flex items-center justify-center min-h-[300px]'>
                <Loader className='animate-spin w-8 h-8 text-primary' />
            </div>
        )
    }

    if (!user) return null;

   
    return (
        <div className="space-y-6 mt-6 p-4 bg-[#f7f7f8] dark:bg-background rounded-2xl shadow-xl 
        min-h-[400px] border border-border/50 hidden md:block">
           
            <div className='flex justify-between items-center p-3 bg-white dark:bg-card rounded-xl shadow-sm'>
                <div className='flex items-center space-x-3'>
                    <Avatar className='w-11 h-11'>
                        <AvatarImage
                            src={user?.profilePicture}
                            alt='Profile Picture'
                            className='w-full h-full rounded-full'
                        />
                        <AvatarFallback className='bg-primary/20 text-primary font-semibold'>
                            {user?.username?.charAt(0).toUpperCase() || 'CN'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <Link href={`/profile/${user._id}`} className='font-bold text-sm text-foreground 
                                hover:text-primary transition-colors'>
                            {user?.username}
                        </Link>
                        <p className='text-muted-foreground text-xs truncate max-w-[120px]'>
                            {user?.bio || "my profile bio here"}
                        </p>
                    </div>
                </div>
                <button className='font-semibold text-primary text-xs hover:bg-primary/10 hover:text-primary/90 
                         cursor-pointer transition px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1'>
                    <RefreshCw className="w-4 h-4" /> Switch
                </button>
            </div>
            
            {/*  رأس قسم المقترحات */}
            <div className='flex justify-between items-center mt-8 pt-2'>
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary/70" />
                    <h1 className='font-semibold text-sm text-muted-foreground uppercase tracking-wider'>
                        Suggested for you
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchSuggested} title="Refresh" 
                    className="p-1 rounded-full hover:bg-primary/10 transition-colors">
                        <RefreshCw className="w-5 h-5 text-primary" />
                    </button>
                    <Link href='/search?type=users' 
                    className='font-semibold text-primary text-sm cursor-pointer hover:text-primary/80 transition-colors'>
                        See all
                    </Link>
                </div>
            </div>

            {/* قائمة المستخدمين المقترحين */}
            <div className='space-y-4'>
                {suggestedUser.slice(0,5).map((s_user) => {
                    return(
                        <div key={s_user._id} className='flex items-center justify-between bg-white
                                    dark:bg-card hover:scale-[1.025] hover:shadow-md hover:bg-accent/40 p-3 rounded-xl
                                    shadow-sm transition-all duration-200'>
                            <Link href={`/profile/${s_user._id}`} className='flex items-center space-x-3 cursor-pointer'>
                                <Avatar className='w-10 h-10 flex-shrink-0'>
                                    <AvatarImage
                                        src={s_user?.profilePicture}
                                        alt='Profile Picture'
                                        className='w-full h-full rounded-full'
                                    />
                                    <AvatarFallback className='bg-primary/20 text-primary font-semibold text-sm'>
                                        {s_user?.username?.charAt(0).toUpperCase() || 'CN'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='font-semibold text-sm text-foreground hover:underline'>
                                        {s_user?.username}
                                    </p>
                                    <p className='text-muted-foreground text-xs truncate max-w-[120px]'>
                                        {s_user?.bio || "my profile bio here"}
                                    </p>
                                </div>
                            </Link>
                            <button
                                className='text-white text-sm font-semibold flex-shrink-0 ml-2
                                 bg-gradient-to-r from-primary to-blue-500 px-5 py-1 rounded-full 
                                 shadow-sm transition-all duration-150 hover:brightness-110 hover:scale-105'>
                                Follow
                            </button>
                        </div>
                    )
                })}
            </div>
            
            {/*  قسم حقوق النشر والتذييل (Footer)  */}
            <footer className="text-xs text-muted-foreground pt-6">
                <p className='leading-relaxed'>
                    © 2025 KH Media App · About · Help · Privacy · Terms
                </p>
            </footer>
        </div>
    )
}

export default RightSidebar;