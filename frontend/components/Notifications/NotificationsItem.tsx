import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Notifications } from '../hooks/use-notifications'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { cn } from '../../lib/utils'; 

type Props = {
   
    notification: Notifications; 
};


const getNotificationDetails = (notification: Notifications): { text: string; link: string } => {
    const senderUsername = notification.sender.username;
    let text = '';
    let link = '';

    switch (notification.type) {
        case 'like':
            text = `أعجب بمنشورك.`;
            link = `/post/${notification.contentId?._id}`;
            break;
        case 'comment':
            text = `علّق على منشورك.`;
            link = `/post/${notification.contentId?._id}`;
            break;
        case 'follow':
            text = `بدأ بمتابعتك.`;
            link = `/profile/${notification.sender._id}`;
            break;
    }
     if (!notification.contentId?._id) {
        link = '/notifications'; 
    }

    return { text, link };
};

const NotificationsItem = ({ notification }: Props) => {
    const { text, link } = getNotificationDetails(notification);
    
    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
        locale: ar, 
    });

    const isUnread = !notification.isRead;

    return (
        <Link href={link} passHref className="block">
            <div
                className={cn(
                    "flex items-center justify-between p-4 bg-gray-50 dark:bg-muted/80 rounded-xl shadow-sm border border-gray-200 mb-2 hover:bg-gray-100 dark:hover:bg-muted/60 transition duration-200 group",
                    isUnread ? 'ring-2 ring-primary/30' : ''
                )}
            >
                {/* معلومات المُرسِل والنص */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-primary/10">
                        {/* معالجة حالة المرسل المحذوف */}
                        <AvatarImage src={notification.sender?.profilePicture || '/default-avatar.png'} />
                        <AvatarFallback>{notification.sender?.username ? notification.sender.username[0] : '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <p className="font-semibold truncate text-base">
                            <span className="text-primary hover:underline font-bold">
                                {notification.sender?.username || ' Unknown User'}
                            </span>
                            {' '}
                            <span className="dark:text-muted-foreground font-normal text-gray-700">{text}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
                    </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-3">
                    {notification.type !== 'follow' && notification.contentId?.image?.url ? (
                        <div className="relative w-12 h-12">
                            <Image
                                src={notification.contentId?.image?.url}
                                alt="Post Thumbnail"
                                fill
                                className="object-cover rounded-lg group-hover:scale-105 transition"
                                sizes="48px"
                            />
                        </div>
                    ) : notification.type !== 'follow' && !notification.contentId?.image?.url ? (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg text-xs text-gray-400 border">
                          post is deleted
                        </div>
                    ) : null}

                    {isUnread && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" title="Unread"></div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default NotificationsItem;