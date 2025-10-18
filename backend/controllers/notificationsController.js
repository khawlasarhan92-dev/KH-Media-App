

const Notifications = require('../models/notificationsModel');
const catchAsync = require('../utils/catchAsync'); 


exports.getNotifications = catchAsync(async (req, res, next) => {
    const notifications = await Notifications.find({ recipient: req.user.id })
        .sort({ createdAt: -1 })
        .populate({
            path: 'sender',
            select: 'username profilePicture'
        })
        .populate({
            path: 'contentId', 
            select: 'image.url' 
        })
        .limit(50); 

    res.status(200).json({
        status: 'success',
        results: notifications.length,
        data: {
            notifications
        }
    });
});


exports.markAllRead = catchAsync(async (req, res, next) => {
    await Notifications.updateMany(
        { recipient: req.user.id, isRead: false },
        { isRead: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'All notifications marked as read.'
    });
});


