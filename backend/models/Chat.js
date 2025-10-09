const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
  
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
   
    isGroupChat: {
        type: Boolean,
        default: false,
    },
  
    chatName: {
        type: String,
        trim: true,
    }
}, { timestamps: true });






const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;