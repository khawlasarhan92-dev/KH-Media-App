
import React, { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { Button } from '@/components/ui/button';
import { RootState, AppDispatch } from '@/store/store'; 
import { useSelector, useDispatch } from 'react-redux';
import { User } from '@/types'; 
import { followUnfollowUser } from '@/store/userThunks'; 
import { Check } from 'lucide-react';

interface UserResult extends Omit<User, 'posts' | 'savedPosts' | 'isVerified' 
                            | 'email' | 'password' | 'followers' | 'createdAt' | 'updatedAt'> 
    {
    bio?: string;
    following: string[];
    }

type Props = {
    user: UserResult;
    };

const UserSearchResult = ({ user }: Props) => {
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>(); 
    const [isLoadingLocal, setIsLoadingLocal] = useState(false);

    const isFollowing = currentUser?.following.includes(user._id);
    const isCurrentUser = currentUser?._id === user._id;

    const handleFollowUnfollow = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        setIsLoadingLocal(true);
        try {
            await dispatch(followUnfollowUser(user._id)).unwrap();
        } catch (err) {
            // optional: handle/display error here
        } finally {
            setIsLoadingLocal(false);
        }
    };

    return (

    <div className="flex items-center justify-between py-2 px-2 sm:p-3 transition duration-150 bg-gray-100 
        dark:bg-muted/80 rounded-xl border border-gray-200 hover:bg-gray-200/80 dark:hover:bg-muted/60
        hover:shadow-lg hover:scale-[1.02] border-b last:border-b-0">
            
            <Link href={`/profile/${user._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-1.5 rounded-full -ml-1">
                    <Avatar className="w-9 h-9 sm:w-8 sm:h-8 flex-shrink-0 ring-2 ring-primary/10">
                    <AvatarImage src={user.profilePicture || '/default-avatar.png'} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="min-w-0">
                    <p className="font-bold hover:underline truncate dark:text-white">{user.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.bio || 'NO bio available'}</p>
                </div>
            </Link>

            {/* زر المتابعة/إلغاء المتابعة */}
            {!isCurrentUser && (
                <Button 
                    size="sm"
                    className={`ml-3 sm:ml-4 flex-shrink-0 rounded-full transition duration-150 items-center gap-2 inline-flex justify-center min-w-[84px] px-4 py-1
                        ${isFollowing ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : 'bg-gradient-to-r from-primary to-blue-500 text-white hover:brightness-95 shadow-sm'}`}
                    onClick={handleFollowUnfollow}
                    disabled={isLoadingLocal}
                >
                    {isLoadingLocal ? 'Loading...' : isFollowing ? (<><Check className="w-3 h-3" />Following</>) : 'Follow'}
                </Button>
            )}
            {isCurrentUser && (
                <Button variant="outline" size="sm" disabled className="ml-4 flex-shrink-0 opacity-50 cursor-default">
                    This is you
                </Button>
            )}
        </div>
    
    );
};

export default UserSearchResult;