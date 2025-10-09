const User = require('../models/userModel');
const Notifications = require('../models/notificationsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const getDataUri = require('../utils/datauri');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { getSocketIo } = require('../utils/socketState'); 


exports.getProfile = catchAsync(async(req , res , next) =>{
const {id} = req.params;

const user = await User.findById(id)
.select(
"-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm"
).populate({
  path:'posts',
  options:{sort:{createdAt:-1}},
}).populate({
  path:'savedPosts',
  options:{sort:{createdAt:-1}},
});
if(!user){
  return next(new AppError('No user found with this id' , 404));
}
res.status(200).json({
  status:"success",
  data:{
    user,
  }
});
});

exports.editProfile = catchAsync(async(req,res,next) =>{
  const userId = req.user.id;
  const {bio} = req.body;
  const profilePicture = req.file;

  let cloudResponse;
  if(profilePicture){
    const fileUri = getDataUri(profilePicture);
    cloudResponse = await uploadToCloudinary(fileUri);
  } 
  const user = await User.findById(userId).select("-password");
  if(!user){
    return next(new AppError('User not found',404));
  }
  if(bio) user.bio = bio;
  if(profilePicture) user.profilePicture = cloudResponse.secure_url;
  await user.save({validateBeforeSave:false});

 return res.status(200).json({
    status:"success",
    message:"Profile updated successfully",
    data:{
      user,
    }
  });
});

exports.suggestedUser = catchAsync(async(req,res,next) =>{
  const loginUserId = req.user.id;
  const users = await User.find({_id:{$ne:loginUserId}}).select(
"-password -otp -otpExpires -resetPasswordOTP -resetPasswordOTPExpires -passwordConfirm"
  );
  res.status(200).json({
    status:"success",
    data:{
      users,
    }
  });

});


exports.followUnfollow = catchAsync(async(req,res,next) =>{
    const loginUserId = req.user._id;
    const targetUserId = req.params.id;
    
    if(loginUserId.toString() === targetUserId){
        return next(new AppError('You cannot follow/unfollow yourself',400));
    }
    
    const targetUser = await User.findById(targetUserId);
    if(!targetUser){
        return next(new AppError('No user found',404));
    }
    
    const isFollowing = targetUser.followers.includes(loginUserId);
    
    if(isFollowing){
        await Promise.all([
            User.updateOne({_id:loginUserId,},{$pull:{following:targetUserId}}),
            User.updateOne({_id:targetUserId,},{$pull:{followers:loginUserId}}),
        ]);

        await Notifications.deleteOne({
            recipient: targetUserId,
            sender: loginUserId,
            type: 'follow',
            contentId: loginUserId
        });


    }else
      {
        await Promise.all([
            User.updateOne({_id:loginUserId,},{$addToSet:{following:targetUserId}}),
            User.updateOne({_id:targetUserId,},{$addToSet:{followers:loginUserId}}),
        ]);
        await Notifications.create({
            recipient: targetUserId,
            sender: loginUserId,
            type: 'follow',
            contentId: loginUserId 
        });
         try {
            const io = getSocketIo();
            const recipientId = targetUserId.toString(); 
            
            io.to(recipientId).emit('newNotification', {
                type: 'follow',
                sender: req.user.username,
                senderId: loginUserId, 
                senderProfilePicture: req.user.profilePicture,
            });
            
        } catch (error) {
            console.error('SOCKET ERROR: Failed to emit follow notification:', error.message);
        }
    }

    const updateLoggedInUser = await User.findById(loginUserId).select("-password");
    
    res.status(200).json({
        status:"success",
        message:isFollowing ? 'Unfollowed successfully' : ' Followed successfully',
        data:{
            user:updateLoggedInUser,
        }
    });
});
exports.getMe = catchAsync(async(req,res,next) =>{
  const user = req.user;
  if(!user){
    return next(new AppError('User not Authenticated',404));
  }
  res.status(200).json({
    status:"success",
    message:"User Authenticated",
    data:{
      user,
    },
  });
});










