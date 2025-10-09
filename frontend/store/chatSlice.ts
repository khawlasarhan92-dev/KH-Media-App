import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Sender {
    _id: string;
    username: string;
    profilePicture: string;
}

interface Message {
    _id: string;
    chat: string;
    sender: Sender;
    content: string;
    readBy: string[];
    createdAt: string;
}

interface Chat {
    _id: string;
    members: Sender[]; 
    latestMessage?: Message;
    isGroupChat: boolean;
    chatName: string;
    createdAt: string;
     unreadCount?: number;
}

interface ChatState {
    chats: Chat[]; 
    selectedChat: Chat | null; 
    messages: Message[]; 
     activeUsers: string[]; 
    isLoading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    chats: [],
    selectedChat: null,
    messages: [],
    activeUsers: [],
    isLoading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
            state.selectedChat = action.payload;
            state.messages = [];
        },
        
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload;
        },

        addNewMessage: (state, action: PayloadAction<Message>) => {
            const newMessage = action.payload;

            if (!newMessage._id.startsWith('temp-')) {
                state.messages = state.messages.filter(msg => {
                    return !(
                        msg._id.startsWith('temp-') &&
                        msg.content === newMessage.content &&
                        msg.sender?._id === (newMessage.sender?._id || newMessage.sender) &&
                        msg.chat === newMessage.chat
                    );
                });
            }

            const isDuplicate = state.messages.some(msg => msg._id === newMessage._id);
            if (isDuplicate) {
                return;
            }
            state.messages.push(newMessage);

            const chatIndex = state.chats.findIndex(chat => chat._id === newMessage.chat);
            if (chatIndex !== -1) {
                state.chats[chatIndex].latestMessage = newMessage;
            }
     },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
            state.isLoading = false;
        },

        addChat: (state, action: PayloadAction<Chat>) => {
            state.chats.unshift(action.payload);
        },
   
        setActiveUsers: (state, action: PayloadAction<string[]>) => {
            state.activeUsers = action.payload;
        },

        resetChatState: (state) => {
            state.chats = [];
            state.selectedChat = null;
            state.messages = [];
            state.activeUsers = [];
            state.isLoading = false;
            state.error = null;
        },

    },
});

export const { 
    setSelectedChat, 
    setChats, 
    addNewMessage, 
    setLoading, 
    setMessages, 
    addChat ,
    setActiveUsers,
    resetChatState
} = chatSlice.actions;

export default chatSlice.reducer;