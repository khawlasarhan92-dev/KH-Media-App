'use client'; 

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import LeftSidebar from '../Home/LeftSidebar'; 

type Props = {
    children: ReactNode;
};

const AppLayout = ({ children }: Props) => {
    const pathname = usePathname();
    
    const isMessagesPage = pathname === '/messages';

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-500">
            {!isMessagesPage && (
                <div className="hidden md:block sticky top-0 h-screen flex-shrink-0 w-[20%] border-r 
                border-border/50 bg-background">
                    <LeftSidebar />
                </div>
            )}
            <main className="flex-1 w-full flex pb-16 md:pb-0 justify-center bg-background">
                <div className="w-full max-w-4xl h-full flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AppLayout;