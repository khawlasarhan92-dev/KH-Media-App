'use client'
import { HomeIcon, LogOut, MessageCircle, Search, SquarePlus, Bell } from 'lucide-react';
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';
import { resetChatState } from '@/store/chatSlice';
import { toast } from 'sonner';
import CreatePostModel from './CreatePostModel';
import Link from 'next/link'; 
import useNotifications from '@/components/hooks/use-notifications'; 


type LinkItem = {
    icon: React.ReactNode;
    label: string;
    href: string; 
    onClick?: () => void; 
    hasBadge?: boolean; 
};

type ButtonItem = {
    icon: React.ReactNode;
    label: string;
    href?: string; 
    onClick: () => void; 
};

type SidebarItem = LinkItem | ButtonItem;


 const LeftSidebar = () => {
    const user = useSelector((state:RootState)=> state.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { unreadCount } = useNotifications();

    const handleLogout = async () => {
        await axios.post(`${BASE_API_URL}/users/logout`, {}, { withCredentials: true });
        dispatch(setAuthUser(null));
        dispatch(resetChatState()); 
        toast.success("Logged out successfully");
        router.push('/auth/login');
    };

    const SidebarItems: SidebarItem[] = [
        { icon: <HomeIcon />, label: "Home", href: "/" },
        { icon: <Search />, label: "Search", href: "/search" },
        { icon: <MessageCircle />, label: "Message", href: "/messages" },
        { icon: <Bell />, label: "Notification", href: "/notifications", hasBadge: true },
        { icon: <SquarePlus />, label: "Create", onClick: () => setIsDialogOpen(true) },
        {
            icon: (
                <Avatar className='w-9 h-9'>
                    <AvatarImage src={user?.profilePicture || 'https://via.placeholder.com/150'} 
                        className='h-full w-full' />
                    <AvatarFallback className='bg-primary/20 text-primary'>CN</AvatarFallback>
                </Avatar>
            ),
            label: "Profile",
            href: `/profile/${user?._id}`
        },
        { icon: <LogOut />, label: "Logout", onClick: handleLogout }
    ];

    const NavLinks = SidebarItems.slice(0, 5); // Home to Create
    const FooterLinks = SidebarItems.slice(5); // Profile and Logout

    return (
    <div className='flex flex-col h-full bg-background dark:bg-background text-card-foreground
             border-r border-border/50 shadow-xl rounded-r-2xl min-h-screen'>
            <CreatePostModel isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
            {/* 2. الشعار */}
            <div className='lg:p-6 p-3 cursor-pointer border-b border-border/50 bg-white dark:bg-card 
                    rounded-tr-2xl shadow-sm'>
                <Link href='/' className='w-fit'>
                    <Image
                        src='/images/mylogo.jpg'
                        alt="Logo"
                        width={120}
                        height={32}
                        className='mt-[0.5rem] object-contain'
                    />
                </Link>
            </div>
            {/* 3. روابط التنقل (الوسط) */}
            <div className='mt-6 flex-1 px-2 lg:px-4'>
                {NavLinks.map((link) => {
                    const hasHref = 'href' in link && typeof link.href === 'string';
                    const isActive = hasHref && (pathname === link.href || (link.label === 'Home' && pathname === '/'));

                    const linkClasses = `
                        flex items-center rounded-full group transition-all duration-300
                        lg:px-4 mb-3 p-3 space-x-4 cursor-pointer w-full shadow-sm
                        ${isActive
                            ? 'bg-primary text-primary-foreground font-bold shadow-md'
                            : 'hover:bg-gray-200 hover:text-accent-foreground text-foreground/80'
                        }
                    `;

                    const linkContent = (
                        <div className='flex items-center w-full relative'>
                            <div className='w-7 h-7 flex items-center justify-center text-xl'>
                                {link.icon}
                            </div>
                            <p className='hidden lg:block lg:text-lg text-base ml-4'>
                                {link.label}
                            </p>
                            {/*  4. إضافة العداد (Badge) */}
                            {'hasBadge' in link && link.hasBadge && unreadCount > 0 && (
                                <span className='absolute top-0 left-7 lg:left-1 lg:top-1 w-2
                                 h-2 rounded-full bg-red-500'></span>
                            )}
                        </div>
                    );

                    return (
                        <div key={link.label}>
                            {hasHref ? (
                                <Link href={(link as LinkItem).href} className={linkClasses}>
                                    {linkContent}
                                </Link>
                            ) : (
                                <div onClick={(link as ButtonItem).onClick} className={linkClasses}>
                                    {linkContent}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* 4. قسم البروفايل وتسجيل الخروج (الأسفل) */}
            <div className='p-4 lg:p-6 mt-auto border-t border-border/50 bg-white dark:bg-card rounded-b-2xl shadow-sm'>
                {FooterLinks.map((link) => {
                    const isProfile = link.label === "Profile";
                    const isLogout = link.label === "Logout";

                    if (isProfile) {
                        return (
                            <Link
                                key={link.label}
                                href={(link as LinkItem).href}
                                className='flex items-center space-x-3 p-3 rounded-full hover:bg-gray-200 
                                    transition-colors mb-2 shadow-sm'
                            >
                                <div className='relative w-10 h-10'>
                                    {link.icon}
                                </div>
                                <div className='hidden lg:block'>
                                    <p className='text-sm font-semibold text-foreground truncate'>
                                        {user?.username || 'User'}
                                    </p>
                                    <p className='text-xs text-muted-foreground truncate'>{user?.email || '@handle'}</p>
                                </div>
                            </Link>
                        );
                    }

                    if (isLogout) {
                        return (
                            <div key={link.label} onClick={(link as ButtonItem).onClick} className='cursor-pointer'>
                                <div className='flex items-center space-x-3 p-3 rounded-full hover:bg-gray-200 
                                        transition-colors shadow-sm'>
                                    {link.icon}
                                    <p className='hidden lg:block lg:text-lg text-base ml-4 text-foreground/80'>Logout</p>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
export default LeftSidebar;