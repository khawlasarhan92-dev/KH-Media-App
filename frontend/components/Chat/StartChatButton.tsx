'use client'

import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store'; 
import { createOrOpenChat } from '@/store/chatThunks';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button'; 
import { MessageSquare } from 'lucide-react';



interface StartChatButtonProps {

    targetUserId: string;

}



const StartChatButton: React.FC<StartChatButtonProps> = ({ targetUserId }) => {

    const dispatch = useDispatch<AppDispatch>();

    const router = useRouter();



	const startChat = async () => {
		try {
		
			const resultAction = await dispatch(createOrOpenChat(targetUserId));
	
			if (createOrOpenChat.fulfilled && resultAction.type === createOrOpenChat.fulfilled.type) {
				router.push('/messages');
			}
		} catch (error) {
			console.error('Failed to start chat:', error);
		}
	};


    return (

		<Button
			onClick={startChat}
			variant="default"
			className="rounded-full px-6 text-sm bg-green-500 hover:bg-green-600 text-white 
				flex items-center gap-2 h-10 min-w-[120px] shadow-sm transition-all"
		>
			<MessageSquare className="w-5 h-5" />
			Message
		</Button>
        );
};

export default StartChatButton;