

const Chat = require('../models/Chat'); 
const Message = require('../models/Message'); 
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
 


exports.sendMessage = catchAsync(async (req, res, next) => {
    const { content, chatId } = req.body;
    const sender = req.user._id; 

    const chat = await Chat.findById(chatId);
    if (!chat) {
        return next(new AppError('Chat not found', 404));
    }
   
    let newMessage = await Message.create({
        sender,
        content,
        chat: chatId,
        readBy: [sender],
    });
  
    chat.latestMessage = newMessage._id;
    await chat.save({ validateBeforeSave: false });

     let populatedMessage = await newMessage.populate('sender', 'username profilePicture');



    
    res.status(201).json({
        status: 'success',
        data: {
            message: populatedMessage,
        },
    });
});