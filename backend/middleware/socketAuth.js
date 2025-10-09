// middleware/socketAuth.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 


module.exports = async (socket, next) => {
    console.log('--- Socket Auth Check Initiated ---');
    let token;

  
    if (socket.handshake.query && socket.handshake.query.token) {
        token = socket.handshake.query.token;
        console.log('Token found in Query string.');
    } 
    
    else if (socket.handshake.headers.cookie) {
        const cookieHeader = socket.handshake.headers.cookie;
        const tokenCookie = cookieHeader.split(';').find(c => c.trim().startsWith('token=')); 

        if (tokenCookie) {
         
            token = tokenCookie.split('=')[1];
            console.log('Token found in Cookie.');
        }
    }

  
    if (!token) {
        console.log('Socket Auth Failed: Token not found in Query or Cookie.');
        return next(new Error('Authentication failed: Token not provided.'));
    }
   
    try {
        console.log('Token received for verification:', token);
     
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(new Error('Authentication failed: User not found.'));
        }
        
        socket.user = currentUser;
        console.log('Socket Auth Success for:', socket.user.username, socket.id); 
        next();
        
    } catch (err) {
        console.error('JWT Verification FAILED:', err.message);
        next(new Error('Authentication failed: Invalid Token or expired.'));
    }
};