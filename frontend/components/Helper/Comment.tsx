'use client'
import { Post, User } from '@/types'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog' 
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import DotButton from './DotButton'
import { Button } from '../ui/button'
import axios from 'axios'
import { BASE_API_URL } from '@/server'
import { handleAuthRequest } from '../utils/apiRequest'
import { toast } from 'sonner'
import { addComment } from '@/store/postSlice'
import { Send } from 'lucide-react'


type Props = {
    post: Post | null,
    user: User | null,
}

const Comment = ({ post, user }: Props) => {
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();

    const addCommentHandler = async (id: string) => {
        if (!comment) return;
        
        if (!post) {
            toast.error('Post not found.');
            return;
        }

        const addCommentReq = async () =>
            await axios.post(`${BASE_API_URL}/posts/comment/${id}`
                , { text: comment }
                , { withCredentials: true });

        const result = await handleAuthRequest(addCommentReq);
        if (result?.data.status === 'success') {
            dispatch(addComment({ postId: id, comment: result?.data.data.comment }));
            toast.success('Comment Posted');
            setComment('');
        }
    };
    
    const commentCount = post?.comments.length || 0;

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <p className='mt-2 text-sm font-semibold text-muted-foreground 
                        hover:text-foreground/80 cursor-pointer transition duration-150'>
                        View All {commentCount} Comment{commentCount !== 1 ? 's' : ''}
                    </p>
                </DialogTrigger>
                <DialogContent className='max-w-4xl p-0 flex h-[85vh] sm:h-[90vh] rounded-xl px-2 sm:px-6'>
                    <DialogTitle className='sr-only'>Post Comments</DialogTitle> 
                    
                    <div className='flex flex-1 w-full'>
                        
                        {/* 1. قسم الصورة */}
                        <div className='hidden max-h-full sm:block sm:w-1/2 bg-gray-200 dark:bg-gray-900 rounded-l-xl'>
                            {post?.image?.url && (
                                <Image 
                                    src={post.image.url} 
                                    alt='Post Image'
                                    width={800} 
                                    height={800}
                                    priority 
                                    className='w-full h-full object-contain rounded-l-xl' 
                                />
                            )}
                        </div>
                        
                        {/* 2. قسم التعليقات */}
                        <div className='w-full sm:w-1/2 flex flex-col border-l border-border/70'>
                            
                            {/* رأس المودال (User Header) */}
                            <div className='flex items-center justify-between p-4 border-b border-border/70'>
                                <div className='flex gap-3 items-center'>
                                    <Avatar className='w-9 h-9'>
                                        <AvatarImage src={post?.user?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className='text-sm font-bold hover:underline cursor-pointer'>
                                            {post?.user?.username}
                                        </p>
                                    </div>
                                </div>
                    
                                <div className='pr-6'> 
                                    <DotButton user={user} post={post} />
                                </div>
                            </div>
                            
                            {/* منطقة عرض التعليقات */}
                            <div className='flex-1 overflow-y-auto p-4'>
                                {post?.caption && (
                                    <div className='flex mb-4 gap-3 items-start'>
                                        <Avatar className='w-8 h-8 flex-shrink-0'>
                                            <AvatarImage src={post?.user?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className='flex flex-col'>
                                            <p className='text-sm font-bold'>
                                                {post?.user?.username}
                                            </p>
                                            <p className='text-sm font-normal text-muted-foreground'>{post.caption}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <hr className='border-border/50 my-3' />

                                {/* قائمة التعليقات */}
                                {post?.comments.map((item) => {
                                    return (
                                        <div key={item._id} className='flex gap-3 items-start mb-4'>
                                            <Avatar className='w-8 h-8 flex-shrink-0'>
                                                <AvatarImage src={item?.user?.profilePicture} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                             <p className='text-sm font-normal text-foreground/90'>
                                                <span className='font-bold cursor-pointer hover:underline mr-1'>
                                                    {item?.user?.username}
                                                </span>
                                                {item?.text}
                                            </p>
                                        </div>
                                    )
                                })}
                                {/* رسالة في حال عدم وجود تعليقات */}
                                {commentCount === 0 && (
                                    <p className='text-center text-muted-foreground py-10'>
                                        No comments yet. Be the first!
                                    </p>
                                )}
                            </div>
                            
                            {/* حقل إضافة التعليق */}
                            <div className='p-4 border-t border-border/70'>
                                <div className='flex items-center gap-2'>
                                    <input 
                                        type='text' 
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder='Add a comment...'
                                        className='w-full outline-none border-none text-sm bg-accent/20 dark:bg-card 
                                                p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent
                                                transition duration-200' 
                                    />
                                    <Button 
                                        variant={'default'} 
                                        size="icon"
                                        className='w-10 h-10 rounded-full bg-primary hover:bg-primary/90' 
                                        onClick={() => {
                                            if (post?._id) addCommentHandler(post._id)
                                        }}>
                                        <Send className='w-4 h-4' />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Comment