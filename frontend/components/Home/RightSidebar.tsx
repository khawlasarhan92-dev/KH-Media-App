"use client"
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import useSuggestedUsers from '@/components/hooks/use-suggested';
import { Loader, RefreshCw, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { followUnfollowUser } from '@/store/userThunks';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

const RightSidebar = () => {
    // جلب البيانات من Redux
    const user = useSelector((state:RootState)=> state.auth.user);
    const { suggested, isLoading, fetchSuggested } = useSuggestedUsers();
    const dispatch = useDispatch<AppDispatch>();
    // track loading per-user to avoid global loading flag affecting all buttons
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

    const handleFollowClick = async (id: string, e?: React.MouseEvent) => {
        e?.preventDefault();
        setLoadingIds(prev => new Set(prev).add(id));
        try {
            await dispatch(followUnfollowUser(id)).unwrap();
        } catch (err) {    
            // optional: handle/display error here
        } finally {
            setLoadingIds(prev => {
                const copy = new Set(prev);
                copy.delete(id);
                return copy;
            });
        }
    };

    if(isLoading){
        return (
            <div className='w-full h-full flex items-center justify-center min-h-[300px]'>
                <Loader className='animate-spin w-8 h-8 text-primary' />
            </div>
        )
    }

    if (!user) return null;

   
    const RightSidebarInner = () => (
        <div className="space-y-6 mt-6 p-4 bg-[#f7f7f8] dark:bg-background rounded-2xl
         shadow-xl min-h-[400px] border border-border/50">
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
                        <Link href={`/profile/${user._id}`} 
                        className='font-bold text-sm text-foreground hover:text-primary transition-colors'>
                            {user?.username}
                        </Link>
                        <p className='text-muted-foreground text-xs truncate max-w-[120px]'>
                            {user?.bio || "my profile bio here"}
                        </p>
                    </div>
                </div>
                <Link href="/edit-profile" aria-label="Account settings" 
                className="inline-flex items-center justify-center p-1.5 rounded-full bg-white/90
                 hover:bg-primary/10 transition shadow-sm border border-border/50">
                    <Settings className="w-4 h-4 text-primary" />
                </Link>
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
                    <Link href='/search?source=suggested'
                     className='font-semibold text-primary text-sm cursor-pointer hover:text-primary/80 transition-colors'>
                        See all
                    </Link>
                </div>
            </div>

            {/* قائمة المستخدمين المقترحين */}
            <div className='space-y-4'>
                {suggested.slice(0,5).map((s_user) => {
                    return(
                        <div key={s_user._id} className='relative flex items-center justify-between bg-white dark:bg-card hover:scale-[1.025] hover:shadow-md hover:bg-accent/40 p-3 rounded-xl shadow-sm transition-all duration-200 overflow-hidden pr-10'>
                            <Link href={`/profile/${s_user._id}`} className='flex items-center space-x-3 cursor-pointer flex-1 min-w-0'>
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
                                <div className='min-w-0'>
                                    <p className='font-semibold text-sm text-foreground hover:underline truncate'>
                                        {s_user?.username}
                                    </p>
                                    <p className='text-muted-foreground text-xs truncate max-w-[120px]'>
                                        {s_user?.bio || "my profile bio here"}
                                    </p>
                                </div>
                            </Link>
                           
                            {!user || user._id === s_user._id ? (
                                <div />
                            ) : (
                <Button
                size="sm"
                className={`ml-3 sm:ml-4 flex-shrink-0 rounded-full transition duration-150 items-center gap-2 inline-flex justify-center min-w-[64px] px-3 py-1 whitespace-nowrap ${user.following?.includes(s_user._id) ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : 'bg-gradient-to-r from-primary to-blue-500 text-white hover:brightness-95 shadow-sm'}`}
                onClick={(e) => handleFollowClick(s_user._id, e)}
                disabled={loadingIds.has(s_user._id)}
            >
                {loadingIds.has(s_user._id) ? 'Loading...' : (user.following?.includes(s_user._id) ? 'Following' : 'Follow')}
            </Button>
                            )}
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

    return (
        <>
            {/* Mobile: floating trigger (only visible on small screens) */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <button aria-label="Open suggestions" className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center p-3 rounded-full bg-white shadow-md border border-border/30">
                            <Users className="w-5 h-5 text-primary" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-0 w-[86vw] max-w-sm">
                        <RightSidebarInner />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop: original sidebar */}
            <div className="hidden md:block">
                <RightSidebarInner />
            </div>
        </>
    )
}

export default RightSidebar;