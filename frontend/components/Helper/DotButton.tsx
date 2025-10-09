'use client'
import React from 'react'
import { Post, User } from '@/types'
import { useDispatch } from 'react-redux'
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Ellipsis, Trash2, UserPlus, UserX } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useFollowUnfollow } from '../hooks/use-auth'
import axios from 'axios'
import { BASE_API_URL } from '@/server'
import { handleAuthRequest } from '../utils/apiRequest'
import { deletePost } from '@/store/postSlice'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Props = {
    post: Post | null,
    user: User | null,
}


const DotButton = ({ post, user }: Props) => {

    const { handleFollowUnfollow } = useFollowUnfollow();
    const router = useRouter();

    const isOwnPost = post?.user?._id === user?._id;

    const isFollowing = post?.user?._id
        ? user?.following.includes(post.user._id)
        : false;

    const dispatch = useDispatch();

    const handleDeletePost = async () => {
        const deletePostReq = async () =>
            await axios.delete(`${BASE_API_URL}/posts/delete-post/${post?._id}`,
                { withCredentials: true });

        const result = await handleAuthRequest(deletePostReq);

        if (result?.data.status === 'success') {
            if (post?._id) {
                dispatch(deletePost(post._id));
                toast.success(result.data.message);
                router.push('/');
            }
        }
    };


    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" 
                            className='w-8 h-8 rounded-full text-foreground/80 hover:bg-accent/50'>
                        <Ellipsis className='w-5 h-5' />
                    </Button>
                </DialogTrigger>

                <DialogContent className='sm:max-w-[320px] p-0 rounded-xl'>
                    <DialogTitle className='hidden'></DialogTitle>

                    <div className='flex flex-col w-full text-center'>

                        {/* 1. زر المتابعة/إلغاء المتابعة */}
                        {!isOwnPost && post?.user?._id && (
                            <DialogClose asChild>
                                <Button
                                    variant={isFollowing ? 'ghost' : 'ghost'}
                                    className={
                                        isFollowing
                                            ? 'w-full justify-center p-4 h-auto rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-900/10 transition mb-1'
                                            : 'w-full justify-center p-4 h-auto rounded-lg border border-primary/30 text-primary font-semibold hover:bg-primary/10 transition mb-1'
                                    }
                                    onClick={() => handleFollowUnfollow(post!.user!._id)}
                                >
                                    {isFollowing ? (
                                        <span className='flex items-center'><UserX className='w-4 h-4 mr-2' /> Unfollow</span>
                                    ) : (
                                        <span className='flex items-center'><UserPlus className='w-4 h-4 mr-2' /> Follow</span>
                                    )}
                                </Button>
                            </DialogClose>
                        )}

                        {/* 2. زر حذف المنشور */}
                        {isOwnPost && (
                            <DialogClose asChild>
                                <Button 
                                    variant='ghost' 
                                    className='w-full justify-center p-4 h-auto rounded-none border-b 
                                        border-border/70 text-red-500 text-base font-semibold hover:bg-red-50 
                                        dark:hover:bg-red-900/10'
                                    onClick={handleDeletePost}
                                >
                                    <Trash2 className='w-4 h-4 mr-2' /> Delete Post
                                </Button>
                            </DialogClose>
                        )}
                        
                        {/* 3. زر الانتقال إلى الحساب */}
                        <DialogClose asChild>
                            <Link href={`/profile/${post!.user!._id}`} className='w-full'>
                                <Button 
                                    variant={'ghost'}
                                    className='w-full justify-center p-4 h-auto rounded-none border-b
                                     border-border/70 text-base'
                                >
                                    About This Account
                                </Button>
                            </Link>
                        </DialogClose>

                        {/* 4. زر الإلغاء/الإغلاق */}
                        <DialogClose asChild>
                            <Button 
                                variant='ghost'
                                className='w-full justify-center p-4 h-auto rounded-none text-base
                                 font-medium text-muted-foreground hover:bg-accent/50'
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                    </div>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DotButton