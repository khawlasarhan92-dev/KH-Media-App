
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel'); 
const Post = require('../models/postModel'); 

exports.searchAll = catchAsync(async (req, res, next) => {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
        return res.status(200).json({
            status: 'success',
            data: { users: [], posts: [] }
        });
    }

    const searchQuery = q.trim();
    const users = await User.find({
        $text: { $search: searchQuery }
    }).select('username profilePicture bio followers following')
      .limit(10); 

    const posts = await Post.find({
        $or: [
            { caption: { $regex: searchQuery, $options: 'i' } },
            { 'comments.text': { $regex: searchQuery, $options: 'i' } }
        ]
    })
    .populate({
        path: 'user',
        select: 'username profilePicture',
    })
    .select('image caption user likes comments')
    .sort({ createdAt: -1 })
    .limit(15);

    res.status(200).json({
        status: 'success',
        data: {
            users,
            posts,
        }
    });
});