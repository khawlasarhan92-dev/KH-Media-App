

const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'follow'],
        required: true
    },
   
    contentId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post' 
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });


notificationsSchema.index({ recipient: 1, createdAt: -1 });

notificationsSchema.index({ recipient: 1, sender: 1, type: 1, contentId: 1 }, { unique: true });

const Notifications = mongoose.model('Notifications', notificationsSchema);

module.exports = Notifications;