const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sharp = require('sharp');
const Post = require('../models/postModel');
const { uploadToCloudinary ,cloudinary } = require('../utils/cloudinary');
const User = require('../models/userModel');
const Notifications = require('../models/notificationsModel');
const mongoose = require('mongoose');
const { getSocketIo } = require ('../utils/socketState');




exports.createPost = catchAsync (async (req, res, next) =>{
  const {caption} = req.body;
  const image = req.file;
  const userId = req.user._id;

  if(!image){
    return next(new AppError('Image is required to create a post',400));
  }
  //optimize image 
  const optimizedImageBuffer = await sharp(image.buffer).resize({
    width:800 ,height:800 ,fit:"inside"
  }).toFormat('jpeg',{quality:80}).toBuffer();

  //convert buffer to data uri
  const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

  //upload to cloudinary
  const cloudResponse = await uploadToCloudinary(fileUri);
  // create post in db
  let post = await Post.create({
    caption,
    image:{
      url:cloudResponse.secure_url,
      publicId:cloudResponse.public_id,
    },
    user:userId,
  });
  //add post to user's posts array
  const user = await User.findById(userId);
  if(user){
    user.posts.push(post.id);
    await user.save({validateBeforeSave:false});
  }
  post = await post.populate({
    path:'user',
    select:'username bio profilePicture email ',
  });
  res.status(201).json({
    status:'success',
    message:'Post created successfully',
    data:{
      post,
    },
  });

  });
exports.getAllPost = catchAsync(async(req , res , next) =>{
  const posts = await Post.find().populate({
    path:'user',
    select:'username profilePicture bio',
  }).populate({
    path:'comments',
    select:'text user',
    populate:{
      path:'user',
       select:'username profilePicture',
    },
  }).sort({createdAt:-1});

  return res.status(200).json({
    status:'success',
    results:posts.length,
    data:{
      posts,
    }

  });

});

exports.getUserPosts = catchAsync(async(req ,res,next) =>{
  const userId = req.params.id;
  const posts = await Post.find({user:userId}).populate({
    path:'comments',
    select:'text user',
    populate:{
      path:'user',
       select:'username profilePicture',
    },
  }).sort({createdAt:-1});

   return res.status(200).json({
    status:'success',
     results:posts.length,
    data:{
      posts,
    }
   });
});

exports.saveOrUnsavePost = catchAsync(async(req ,res,next) =>{
  const userId = req.user._id;
  const postId = req.params.postId;
  const user = await User.findById(userId);

  if(!user){
    return next(new AppError('User not found',404));
  }

  const isPostSave = user.savedPosts.includes(postId);

  if(isPostSave){
    user.savedPosts.pull(postId);
    await user.save({validateBeforeSave:false});
    return res.status(200).json({
      status:'success',
      message:'Post unsaved successfully',
      data:{
        user,
      }
   });
  }else{
    user.savedPosts.push(postId);
     await user.save({validateBeforeSave:false});
      return res.status(200).json({
      status:'success',
      message:'Post saved successfully',
      data:{
        user,
      }
   });
  }

});

exports.deletePost = catchAsync(async(req ,res,next) =>{
  const {id} = req.params;
  const userId = req.user._id;

  const post = await Post.findById(id).populate('user');
  if(!post){
    return next(new AppError('Post not found',404));
  }
  if(post.user._id.toString() !== userId.toString()){
    return next(new AppError('You are not authorized to delete this post',403));
  }
  
  await User.updateOne({_id:userId},{$pull:{posts:id}});
  
  await User.updateMany({savedPosts:id},{$pull:{savedPosts:id}});

 
  if(post.image.publicId){
    await cloudinary.uploader.destroy(post.image.publicId);
  }
  
  await Post.findByIdAndDelete(id);

  return res.status(200).json({
    status:'success',
    message:'Post deleted successfully',
  });

});
exports.likeOrDislikePost = catchAsync(async(req ,res,next) =>{
    const {id:postId} = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId); 
    
    if(!post){
        return next(new AppError('Post not found',404));
    }
    
    const isLiked = post.likes.includes(userId);
    
    if(isLiked){
     
        await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}},{new:true});
        
        await Notifications.deleteOne({
            recipient: post.user._id,
            sender: userId,
            type: 'like',
            contentId: postId,
        });

        return res.status(200).json({
            status:'success',
            message:'Post disliked successfully',
        });

    }else{
        await Post.findByIdAndUpdate(postId,{$addToSet:{likes:userId}},{new:true});
    
        if (post.user.toString() !== userId.toString()) {
            await Notifications.create({
                recipient: post.user,
                sender: userId,
                type: 'like',
                contentId: postId,
            });
        
          try {
                const io = getSocketIo();
                const recipientId = post.user._id.toString(); 
                
                io.to(recipientId).emit('newNotification', {
                    type: 'like',
                    sender: req.user.username,
                    postId: postId,
                    senderProfilePicture: req.user.profilePicture, 
                });
                
            } catch (error) {
                console.error('SOCKET ERROR: Failed to emit like notification:', error.message);
            }
        }
        
        return res.status(200).json({
            status:'success',
            message:'Post liked successfully',
        });
    }
});

exports.addComment = catchAsync(async(req ,res,next) =>{
    const {id:postId} = req.params;
    const {text} = req.body;
    const userId = req.user._id;

    if(!text){
        return next(new AppError('Comment text is required',400));
    }

    const commentSubDoc = {
        text,
        user: userId,
        createdAt: Date.now(),
        _id: new mongoose.Types.ObjectId(), 
    };

   
    let post = await Post.findByIdAndUpdate( 
        postId,
        { $push: { comments: commentSubDoc } },
        { new: true, runValidators: true } 
    );
    
    if(!post){
        return next(new AppError('Post not found',404));
    }
    
    post = await post.populate({
        path: 'comments.user', 
        select: 'username profilePicture',
        match: { '_id': commentSubDoc.user } 
    });

    const newComment = post.comments.find(c => c._id.equals(commentSubDoc._id));
 
    if (post.user.toString() !== userId.toString()) {
         await Notifications.findOneAndUpdate();
           try {
        const io = getSocketIo(); 
        const recipientId = post.user._id.toString(); 
        
      
        io.to(recipientId).emit('newNotification', {
            type: 'comment',
            sender: req.user.username,
            postId: postId,
            commentId: commentSubDoc._id.toString(),
            commentText: text,
            senderProfilePicture: req.user.profilePicture, 
        });
        
    } catch (error) {
        console.error('SOCKET ERROR: Failed to emit comment notification:', error.message);
    }
        
    }

    return res.status(201).json({
        status:'success',
        message:'Comment added successfully',
        data:{
            comment: newComment, 
        }
    });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id)
    .populate({
      path: 'user',
      select: 'username profilePicture bio',
    })
    .populate({
      path: 'comments',
      select: 'text user',
      populate: {
        path: 'user',
        select: 'username profilePicture',
      },
    });

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  return res.status(200).json({
    status: 'success',
    data: { post },
  });
});






