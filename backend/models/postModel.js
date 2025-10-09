

const mongoose = require('mongoose');

//(Comment Sub-schema)
const commentSubSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required for a comment'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
});


const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        maxlength:[2200 , 'Caption cannot be more than 2200 characters'],
        trim:true,
    },
    image:{
        url:{type:String,required:true,},
        publicId:{type:String,required:true,},
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true , 'User is required for a post'],
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
    ],
   
    comments:[commentSubSchema], 
},{timestamps:true,});

postSchema.index({user:1,createdAt:-1});


postSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user', 
        select: 'username profilePicture',
    }).populate({
        path: 'comments.user', 
        select: 'username profilePicture',
    });
    next();
});


const Post = mongoose.model('Post' , postSchema);
module.exports = Post;