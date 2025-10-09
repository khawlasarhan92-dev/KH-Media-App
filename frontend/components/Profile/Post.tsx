
import { User } from '@/types'
import { Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    userProfile?: User | undefined,
}

const Post = ({ userProfile }: Props) => {
   
    if (!userProfile || userProfile.posts?.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center p-16 text-center text-muted-foreground'>
                <Heart className='w-12 h-12 mb-4 text-primary/70' />
                <h2 className='text-2xl font-bold text-foreground mb-2'>No Posts Yet</h2>
                <p>Start sharing your moments with the world!</p>
            </div>
        )
    }

    return (
       
    <div className='mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4'>
            {userProfile?.posts?.map((post) => {
                return (
                    <div
                        key={post._id}
                        className='relative group overflow-hidden cursor-pointer aspect-square bg-gray-100
                         dark:bg-gray-700 rounded-xl border border-gray-200 transition-shadow 
                         duration-300 hover:shadow-lg'
                    >
                        <Image
                            src={`${post?.image?.url}`}
                            alt='Post'
                            layout='fill'
                            objectFit='cover'
                            className='w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-xl'
                        />
                        {/* التراكب (Overlay) */}
                        <div className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300'>
                            <div className='flex space-x-8'>
                                {/* زر الإعجاب */}
                                <div className='flex items-center space-x-2 text-white font-bold text-xl group/like'>
                                    <Heart className='w-7 h-7 fill-white group-hover/like:fill-red-500 transition-colors 
                                            duration-200' />
                                    <span>{post?.likes.length}</span>
                                </div>
                                {/* زر التعليق */}
                                <div className='flex items-center space-x-2 text-white font-bold text-xl'>
                                    <MessageCircle className='w-7 h-7' />
                                    <span>{post?.comments.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Post