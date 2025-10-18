'use client';
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store'; 
import { Send, Paperclip } from 'lucide-react'; 
import { useSocket } from '../Socket/SocketProvider'; 
import { addNewMessage } from '../../store/chatSlice'; 
import { sendNewMessage } from '../../store/chatThunks';
import { TempMessage } from '../../store/chatSlice';


interface MessageInputProps {
    chatId: string;
}



const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
    const [content, setContent] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { socket } = useSocket();
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id); 

    const handleSendMessage = useCallback(async () => {
        if (!chatId || content.trim() === '' || !currentUserId || !socket) return;

        const messageContent = content.trim();

        const tempMessage : TempMessage = {
            _id: `temp-${Date.now()}`,
            chat: chatId,
            content: messageContent,
            sender: { _id: currentUserId }, 
            createdAt: new Date().toISOString(),
            status: 'sending',
            readBy: [currentUserId], 
        };

        dispatch(addNewMessage(tempMessage));
        setContent('');

         const result = await dispatch(sendNewMessage({ chatId, content: messageContent }));

            if (sendNewMessage.fulfilled.match(result)) {
            const newMessage = result.payload;

                console.log('Emitting send_message via socket with:', newMessage);
                socket.emit('send_message', { newMessage }); 
            }

       
    }, [chatId, content, dispatch, currentUserId , socket]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const isInputEmpty = content.trim() === '';

    return (
        <form
            className="flex items-center gap-2 bg-blue-50 rounded-none md:rounded-xl 
            shadow px-1 sm:px-2 md:px-3 py-2 md:py-3 w-full"
            onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
            }}
        >
            <button
                type="button"
                className="p-2 rounded-full hover:bg-blue-100 text-blue-500 transition"
                title="file attachment"
            >
                <Paperclip className="w-5 h-5" />
            </button>
            <textarea
                className="flex-1 resize-none bg-transparent outline-none border-none px-2 py-1 
                text-sm text-gray-800 placeholder-gray-400 max-h-24 overflow-auto"
                rows={1}
                placeholder="Type a message..."
                value={content}
                onChange={e => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                dir="auto"
            />
            <button
                type="submit"
                disabled={isInputEmpty}
                className={`ml-1 w-10 h-10 flex items-center justify-center rounded-full
                     shadow-md transition text-white
                      ${isInputEmpty ? 'bg-blue-200 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                title="Send"
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
    );
};

export default MessageInput;