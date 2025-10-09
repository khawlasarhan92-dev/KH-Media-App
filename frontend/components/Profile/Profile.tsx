'use client'

import { BASE_API_URL } from '@/server'
import { RootState } from '@/store/store'
import { User } from '@/types'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { handleAuthRequest } from '../utils/apiRequest'
import { Bookmark, Grid, Loader } from 'lucide-react'
import LeftSidebar from '../Home/LeftSidebar'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet'
import { MenuIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import Post from './Post' 
import Save from './Save' 
import { useFollowUnfollow } from '../hooks/use-auth'
import StartChatButton from '../Chat/StartChatButton' 

type Props = {
    id: string,
}

const Profile = ({ id }: Props) => {
    const { handleFollowUnfollow } = useFollowUnfollow();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const [postOrSave, setPostOrSave] = useState<string>("POST");
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState<User>();

    const isOwnProfile = user?._id === id;
    const isFollowing = user?.following?.includes(id);

    useEffect(() => {
        if (!user) {
            return router.push('/auth/login');
        }
        const getUser = async () => {
            const getUserReq = async () =>
                await axios.get(`${BASE_API_URL}/users/Profile/${id}`);
            const result = await handleAuthRequest(getUserReq, setIsLoading);
            if (result) {
                setUserProfile(result?.data.data.user);
            }
        };
        getUser();

    }, [user, router, id]);

  
    if (isLoading) {
        return (
            <div className='w-full h-screen flex items-center justify-center flex-col'>
                <Loader className='animate-spin text-primary w-8 h-8' />
            </div>
        )
    }

    if (!userProfile) {
        return (
            <div className='w-full h-screen flex items-center justify-center 
                text-xl font-semibold text-muted-foreground'>
                User not found.
            </div>
        )
    }

    return (
        <div className="flex mb-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
            <div className="w-[20%] hidden md:block border-r border-border/70 h-screen fixed">
                <LeftSidebar />
            </div>

            <div className="flex-1 md:ml-[20%] overflow-auto w-full">
                <div className="md:hidden p-4 border-b border-border/70">
                    <Sheet>
                        <SheetTrigger>
                            <MenuIcon className="w-6 h-6" />
                        </SheetTrigger>
                        <SheetContent side="left">
                            <LeftSidebar />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="w-[90%] sm:w-[80%] mx-auto p-4 md:p-8">
                    
                    <div className="mt-8 md:mt-16 flex md:flex-row flex-col items-center md:items-start
                            pb-10 border-b border-border/70 md:space-x-16 bg-white/80 shadow-sm 
                            rounded-2xl px-6 md:px-12 pt-8">
                        {/* صورة البروفايل */}
                        <Avatar className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 mb-6 md:mb-0 border-4
                         border-border/50 shadow-lg rounded-full">
                            <AvatarImage src={userProfile?.profilePicture} alt="Profile Picture" />
                            <AvatarFallback className="bg-primary/20 text-primary text-4xl">
                                {userProfile?.username?.charAt(0).toUpperCase() || "CN"}
                            </AvatarFallback>
                        </Avatar>

                        {/* المعلومات والإحصائيات */}
                        <div className="flex flex-col items-center md:items-start space-y-4 w-full">
                            <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {userProfile?.username}
                                </h1>

                                {/* أزرار الإجراء (Edit/Follow/Unfollow) */}
                                {isOwnProfile ? (
                                    <Link href="/edit-profile">
                                        <Button variant="outline" className="rounded-full px-6 text-sm hover:bg-accent/50
                                             transition-all">
                                            Edit Profile
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="flex gap-4 items-center">
                                        <StartChatButton targetUserId={id} />
                                        <Button
                                            variant={isFollowing ? "destructive" : "default"}
                                            className={cn(
                                                "rounded-full px-6 text-sm h-10 min-w-[120px] transition-all",
                                                isFollowing 
                                                ? "bg-destructive hover:bg-destructive/80" 
                                                : "bg-primary hover:bg-primary/90 text-white"
                                            )}
                                            onClick={() => {
                                                handleFollowUnfollow(id);
                                            }}
                                        >
                                            {isFollowing ? "Unfollow" : "Follow"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* الإحصائيات (Stats) */}
                            <div className="flex flex-wrap gap-6 text-base md:text-lg pt-2">
                                <p className="font-semibold">
                                    <span className="font-bold mr-1">{userProfile?.posts?.length || 0}</span> Posts
                                </p>
                                <p className="font-semibold">
                                    <span className="font-bold mr-1">{userProfile?.followers?.length || 0}</span> Followers
                                </p>
                                <p className="font-semibold">
                                    <span className="font-bold mr-1">{userProfile?.following?.length || 0}</span> Following
                                </p>
                            </div>

                            {/* البايو (Bio) */}
                            <p className="w-full max-w-lg pt-2 text-center md:text-left text-gray-500 text-base font-normal">
                                {userProfile?.bio || "My Profile Bio Here"}
                            </p>
                        </div>
                    </div>

                    {/* (Posts & Saved)  */}
                    <div className="mt-10">
                        <div className="flex items-center justify-center border-b border-border/70 gap-4 md:gap-14">
                            {/* تبويب المنشورات */}
                            <button
                                className={cn(
                                    "flex items-center gap-2 py-2 px-4 cursor-pointer transition-colors rounded-full text-base font-medium",
                                    postOrSave === "POST"
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
                                )}
                                onClick={() => setPostOrSave("POST")}
                            >
                                <Grid className="w-5 h-5" />
                                <span className="text-sm"> POSTS </span>
                            </button>

                            {/* تبويب المحفوظات  */}
                            {isOwnProfile && (
                            <button
                                className={cn(
                                    "flex items-center gap-2 py-2 px-4 cursor-pointer transition-colors rounded-full text-base font-medium",
                                    postOrSave === "SAVE"
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
                                )}
                                onClick={() => setPostOrSave("SAVE")}
                            >
                                <Bookmark className="w-5 h-5" />
                                <span className="text-sm"> SAVED </span>
                            </button>
                            )}
                        </div>

                        {/*  محتوى التبويبات */}
                        <div className="mt-6">
                            {postOrSave === "POST" && <Post userProfile={userProfile} />}
                            {postOrSave === "SAVE" && <Save userProfile={userProfile} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;