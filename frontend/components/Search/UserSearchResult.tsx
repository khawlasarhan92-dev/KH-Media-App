
import React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { Button } from '@/components/ui/button';
import { RootState, AppDispatch } from '@/store/store'; 
import { useSelector, useDispatch } from 'react-redux';
import { User } from '@/types'; 
import { followUnfollowUser } from '@/store/userThunks'; 

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
    const isUpdating = useSelector((state: RootState) => state.auth.isLoading); 
    const dispatch = useDispatch<AppDispatch>(); 

    const isFollowing = currentUser?.following.includes(user._id);
    const isCurrentUser = currentUser?._id === user._id;

    const handleFollowUnfollow = (e: React.MouseEvent) => {
        e.preventDefault(); 
        if (!currentUser) return; 
        
        dispatch(followUnfollowUser(user._id));
    };

    return (

    <div className="flex items-center justify-between p-3 transition duration-150 bg-gray-100 
            dark:bg-muted/80 rounded-xl border border-gray-200 hover:bg-gray-200/80 dark:hover:bg-muted/60
            hover:shadow-lg hover:scale-[1.02] border-b last:border-b-0">
            
            <Link href={`/profile/${user._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-8 h-8 flex-shrink-0 ring-2 ring-primary/10">
                    <AvatarImage src={user.profilePicture || '/default-avatar.png'} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <p className="font-bold hover:underline truncate dark:text-white">{user.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.bio || 'NO bio available'}</p>
                </div>
            </Link>

            {/* زر المتابعة/إلغاء المتابعة */}
            {!isCurrentUser && (
                <Button 
                    variant={isFollowing ? 'outline' : 'default'}
                    size="sm"
                    className={`ml-4 flex-shrink-0 rounded-full transition-colors duration-150 border
                         ${isFollowing 
                            ? 'hover:bg-red-100 hover:text-red-600' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    onClick={handleFollowUnfollow}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Loading...' : isFollowing ? 'Followed' : 'Follow'}
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