'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import axios from 'axios'
import { BASE_API_URL } from '@/server'
import { handleAuthRequest } from '../utils/apiRequest'
import { addComment, likeOrDislike, setPosts } from '@/store/postSlice'
import { Bookmark, HeartIcon, MessageCircle, Send, Loader } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import DotButton from '../Helper/DotButton'
import Image from 'next/image'
import Comment from '../Helper/Comment'
import { toast } from 'sonner'
import { setAuthUser } from '@/store/authSlice'
import Link from 'next/link';

const Feed = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const posts = useSelector((state: RootState) => state.posts.posts);

    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getAllPost = async () => {
            const getAllPostReq = async () =>
                await axios.get(`${BASE_API_URL}/posts/all`);
            const result = await handleAuthRequest(getAllPostReq, setIsLoading);
            if (result) {
                dispatch(setPosts(result.data.data.posts));
            }
        };
        getAllPost();
    }, [dispatch]);

    const handleLikeDislike = async (id: string) => {
        const result = await axios.post(`${BASE_API_URL}/posts/like-dislike-post/${id}`, 
            {}, { withCredentials: true });
        if (result.data.status === 'success') {
            if (user?._id) {
                dispatch(likeOrDislike({ postId: id, userId: user?._id }));
                toast(result.data.message);
            }
        }
    };

    const handleSaveUnsave = async (id: string) => {
        const result = await axios.post(`${BASE_API_URL}/posts/save-unsave-post/${id}`,
             {}, { withCredentials: true });
        if (result.data.status === 'success') {
            dispatch(setAuthUser(result.data.data.user));
            toast.success(result.data.message);
        }
    };

    const handleComment = async (id: string) => {
        if (!comment) return;
        const addCommentReq = async () =>
            await axios.post(`${BASE_API_URL}/posts/comment/${id}`, 
                { text: comment }, { withCredentials: true });

        const result = await handleAuthRequest(addCommentReq);
        if (result?.data.status === 'success') {
            dispatch(addComment({ postId: id, comment: result?.data.data.comment }));
            toast.success('Comment Posted');
            setComment('');
        }
    };

    if (isLoading) {
        return (
            <div className='w-full flex justify-center items-center h-screen flex-col
                     bg-[#f7f7f8] dark:bg-background'>
                <Loader className='animate-spin text-primary w-8 h-8' />
            </div>
        );
    }
    if (posts.length < 1) {
        return (
            <div className='text-2xl text-center m-8 font-bold capitalize text-muted-foreground
                     bg-[#f7f7f8] dark:bg-background rounded-2xl shadow-md p-8'>
                No posts available. Start creating!
            </div>
        );
    }

    return (
    <div className='mt-2 w-full max-w-md mx-auto px-0 bg-[#ececec] dark:bg-[#23272f] min-h-screen'>
            {posts.map((post) => {
                return (
                    <div
                        key={post._id}
                        className='mb-2 bg-[#ececec] dark:bg-[#23272f] border border-border/10 
                            rounded-none shadow-none overflow-hidden'
                    >

                       
                        <div className='flex items-center justify-between p-4'>
                            <Link href={`/profile/${post.user?._id}`} className='flex items-center space-x-3 cursor-pointer'>
                                <Avatar className='w-10 h-10'>
                                    <AvatarImage src={post.user?.profilePicture} className='h-full w-full' />
                                    <AvatarFallback className='bg-primary/20 text-primary font-semibold text-sm'>
                                        {post.user?.username?.charAt(0).toUpperCase() || 'C'}
                                    </AvatarFallback>
                                </Avatar>
                                <h1 className='font-bold text-base hover:text-muted-foreground transition-colors'>
                                    {post.user?.username}
                                </h1>
                            </Link>
                         
                            <DotButton post={post} user={user} />
                        </div>


                        <div className='w-full aspect-video relative bg-gray-100 dark:bg-gray-700 p-0'>
                            <Image
                                src={`${post.image?.url}`}
                                alt={post.caption || 'post image'}
                                layout='fill'
                                objectFit='cover'
                                className='w-full h-full rounded-lg shadow-sm'
                            />
                        </div>

                     
                        <div className='p-2 pt-1'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-6 text-2xl'>
                                   
                                    <HeartIcon
                                        onClick={() => handleLikeDislike(post?._id)}
                                        className={`cursor-pointer w-8 h-8 transition-transform duration-150 active:scale-90
                                            ${user?._id && post.likes.includes(user?._id)
                                                ? 'fill-red-500 text-red-500' : 'text-foreground hover:text-red-400'}`}
                                    />
                                 
                                    <MessageCircle
                                        className='cursor-pointer w-8 h-8 text-foreground hover:text-primary transition-colors'
                                    />
                               
                                    <Send
                                        className='cursor-pointer w-8 h-8 text-foreground hover:text-primary
                                         transition-colors rotate-45 -mt-1'
                                    />
                                </div>

                             
                                <Bookmark
                                    onClick={() => { handleSaveUnsave(post?._id) }}
                                    className={`cursor-pointer w-8 h-8 transition-colors
                                        ${(user?.savedPosts as string[])?.some((savePostId: string) =>
                                             savePostId === post._id)
                                            ? 'fill-primary text-primary'
                                            : 'text-foreground hover:text-primary'}`}
                                />
                            </div>

                            <h1 className='mt-2 text-xs font-bold text-foreground'>
                                {post.likes.length} likes
                            </h1>

                            <p className='mt-1 font-medium text-xs text-foreground'>
                                <span className='font-bold mr-1'>{post.user?.username}</span>
                                {post.caption}
                            </p>

                            {post.comments.length > 0 && (
                                <button className='text-sm text-muted-foreground hover:underline mt-1'>
                                    View all {post.comments.length} comment(s)
                                </button>
                            )}
                            <Comment post={post} user={user} />

                       
                            <div className='mt-3 pt-3 border-t border-border/70 flex items-center gap-2'>
                                <input
                                    type='text'
                                    placeholder='Add a comment...'
                                    className='flex-1 bg-white dark:bg-background rounded-full px-4 py-2 
                                    placeholder:text-muted-foreground outline-none text-sm border-2 border-primary/30
                                     focus:border-primary focus:ring-2 focus:ring-primary/20 transition'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <button
                                    role='button'
                                    className={`text-base font-bold ml-2 px-5 py-2 rounded-full shadow-md transition-colors
                                        ${comment.trim() === '' 
                                            ? 'bg-primary/20 text-primary/50 cursor-not-allowed' 
                                            : 'bg-primary text-white hover:bg-primary/90'}`}
                                    onClick={() => { if (comment.trim() !== '') handleComment(post._id) }}
                                    disabled={comment.trim() === ''}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Feed;