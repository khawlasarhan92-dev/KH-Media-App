
const Chat = require('../models/Chat');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Message = require('../models/Message');
 const mongoose = require('mongoose');


exports.getChats = catchAsync(async (req, res, next) => {
    let chats = await Chat.find({ members: req.user.id })
        .populate('latestMessage') 
        .populate({
            path: 'members', 
            select: 'username profilePicture email', 
          
        })
        .sort({ updatedAt: -1 }) 
        .lean(); 

   
    const chatsWithUnreadCount = await Promise.all(
        chats.map(async (chat) => {
            if (!chat.latestMessage) {
                chat.unreadCount = 0;
                return chat;
            }
            const unreadCount = await Message.countDocuments({
                chat: chat._id,
                sender: { $ne: req.user.id },
                readBy: { $ne: req.user.id }
            });
            return {
                ...chat,
                unreadCount: unreadCount,
                latestMessage: chat.latestMessage
            };
        })
    );

    res.status(200).json({
        status: 'success',
        results: chatsWithUnreadCount.length,
        data: {
            chats: chatsWithUnreadCount,
        },
    });
});


exports.createOrGetChat = catchAsync(async (req, res, next) => {
    
    const { userId } = req.body; 
    const currentUserId = req.user.id;
    
    if (!userId || userId.toString() === currentUserId.toString()) {
        return next(new AppError('Invalid chat request.', 400));
    }

    
    const memberIdStrings = [currentUserId.toString(), userId.toString()];
    memberIdStrings.sort();
    
    const membersArr = memberIdStrings.map(id => new mongoose.Types.ObjectId(id));

    const query = {
        isGroupChat: false,
        members: membersArr 
    };

   
    let chat = await Chat.findOne(query).populate({
        path: 'members',
        select: 'username profilePicture email',
    });

    if (chat) {
        return res.status(200).json({
            status: 'success',
            message: 'Chat already exists.',
            data: { chat },
        });
    }
   
    try {
        const newChat = await Chat.create({
            chatName: 'Sender', 
            isGroupChat: false,
            members: membersArr,
        });

        chat = await Chat.findOne({ _id: newChat._id }).populate({
            path: 'members',
            select: 'username profilePicture email',
        });

        return res.status(201).json({
            status: 'success',
            message: 'New chat created.',
            data: { chat },
        });

    } catch (err) {
     
        if (err.code === 11000) {
          
            chat = await Chat.findOne(query).populate({
                path: 'members',
                select: 'username profilePicture email',
            });
            
            if (chat) {
                 return res.status(200).json({
                    status: 'success',
                    message: 'Concurrency resolved: found existing chat.',
                    data: { chat },
                });
            }
        }
     
        return next(err);
    }
});

exports.getMessages = catchAsync(async (req, res, next) => {
    const { chatId } = req.params;
    const currentUserId = req.user.id;

   
    const chat = await Chat.findById(chatId);

    if (!chat || !chat.members.map(id => id.toString()).includes(currentUserId.toString())) {
        return next(new AppError('Chat not found or you are not a member.', 404));
    }

   
    const messages = await Message.find({ chat: chatId })
        .populate('sender', 'username profilePicture')
        .sort({ createdAt: 1 });


    await Message.updateMany(
        { chat: chatId, readBy: { $ne: currentUserId } },
        { $addToSet: { readBy: currentUserId } }
    );

    res.status(200).json({
        status: 'success',
        results: messages.length,
        data: { messages },
    });
});


