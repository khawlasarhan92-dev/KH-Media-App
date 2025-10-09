'use client'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'; 
import Image from 'next/image';
import LoadingButton from '../Helper/LoadingButton';
import { Button } from '../ui/button';
import { ImageIcon, X } from 'lucide-react'; 
import { toast } from 'sonner';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest';
import { addPost } from '@/store/postSlice';
import { cn } from '@/lib/utils';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const CreatePostModel = ({ isOpen, onClose }: Props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [caption, setCaption] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    
    useEffect(() => {
        if (!isOpen) {
            setSelectedImage(null);
            setPreviewImage(null);
            setCaption('');
        }
    }, [isOpen]);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current?.click();
        }
    };

    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size should not exceed 10MB");
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(file);
            setPreviewImage(imageUrl);
        }
    };

  
    const handleCreatePost = async () => {
        if (!selectedImage) {
            toast.error("Please select an image to create a post");
            return;
        }
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('caption', caption);

        const createPostReq = async () =>
            await axios.post(`${BASE_API_URL}/posts/create-post`,
                formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        const result = await handleAuthRequest(createPostReq, setIsLoading);
        if (result) {
            dispatch(addPost(result.data.data.post));
            toast.success("Post created successfully");
            setSelectedImage(null);
            setPreviewImage(null);
            setCaption('');
            onClose();
            router.push('/');
            router.refresh();
        }
    };


return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={cn("sm:max-w-[425px]",
             previewImage && "sm:max-w-4xl max-h-[90vh] overflow-hidden p-0")}> 
            
            {previewImage ? (
                <div className='flex flex-col h-full'>
                    <DialogHeader className='border-b border-border/70 p-4'>
                        <DialogTitle className='text-center text-2xl font-bold'>
                            Finalize Post
                        </DialogTitle>
                    </DialogHeader>
                    <div className='flex flex-col md:flex-row h-full overflow-y-auto'>
                        <div className='flex-1 flex items-center justify-center p-4 min-h-[350px] max-h-[60vh]'>
                            <div className='w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800
                             rounded-lg border border-border overflow-hidden'>
                                <img
                                    src={previewImage}
                                    alt="Post Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                        <div className='w-full md:w-[350px] flex flex-col p-4 border-t md:border-t-0 
                        md:border-l border-border/70'>
                            
                            <textarea
                                placeholder='Write a caption for your post...'
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows={8}
                                className='w-full p-3 border border-border/70 rounded-lg resize-none text-left
                                 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm 
                                 dark:bg-card/30 transition duration-200 flex-grow mb-4'
                            />
                            <div className='flex flex-col justify-end gap-3 w-full mt-auto'>
                                
                                <Button
                                    className="w-full bg-primary text-white hover:bg-primary/90 font-semibold text-base"
                                    onClick={handleCreatePost}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Creating..." : "Create Post"}
                                </Button>
                    
                                <Button
                                    variant="outline"
                                    className="w-full font-semibold text-base"
                                    onClick={() => {
                                        setPreviewImage(null);
                                        setSelectedImage(null);
                                        setCaption('');
                                    }}
                                >
                                    Change Image
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            ) : (
                <>
                    <DialogHeader>
                        <DialogTitle className='text-center text-xl font-bold mt-3 mb-3'>
                            Upload Image
                        </DialogTitle>
                    </DialogHeader>
                    <div className='flex flex-col items-center justify-center text-center space-y-6 py-12'>
                        <ImageIcon size={64} className='text-primary/70' />
                        <p className='text-muted-foreground text-base'>
                            Select an image from your device
                        </p>
                        <Button 
                            className='bg-primary text-white hover:bg-primary/90 rounded-lg px-8 py-2 font-semibold'
                            onClick={handleButtonClick}
                        >
                            Select from device
                        </Button>
                        <input 
                            type='file' 
                            accept='image/*' 
                            className='hidden'
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                        />
                    </div>
                </>
            )}
        </DialogContent>
    </Dialog>
)
}

export default CreatePostModel