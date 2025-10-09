'use client'
import React from 'react';
import useNotifications from '@/components/hooks/use-notifications'; 
import NotificationsItem from '../../components/Notifications/NotificationsItem'; 
import { Button } from '@/components/ui/button'; 
import { Loader2, Bell, CheckCheck } from 'lucide-react';
import AppLayout from '../../components/Layout/AppLayout'; 

const NotificationsPage = () => {
    const { notifications, isLoading, unreadCount, markAllRead } = useNotifications();

    return (
        <AppLayout> 
            <div className="flex-1 max-w-2xl mx-auto p-4 sm:p-6">
                
                {/* رأس الصفحة */}
                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Bell className="w-6 h-6 text-primary" />
                        Notifications
                    </h1>
                    
                    {/* زر تحديد الكل كمقروء */}
                    {unreadCount > 0 && (
                        <Button 
                            variant="link" 
                            size="sm"
                            onClick={markAllRead}
                            className="text-primary hover:underline transition duration-150"
                            disabled={isLoading}
                        >
                            <CheckCheck className="w-4 h-4 ml-1 rtl:mr-1" />
                            Marked as read ({unreadCount})
                        </Button>
                    )}
                </div>

                {/* منطقة عرض الإشعارات */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <Bell className="w-12 h-12 mx-auto mb-4" />
                        <p className="text-lg font-semibold">No notifications yet.</p>
                        <p className="text-sm">Start interacting with posts and follow users.</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {notifications.map((notification) => (
                            <NotificationsItem key={notification._id} notification={notification} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default NotificationsPage;