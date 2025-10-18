// middleware/socketAuth.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 


module.exports = async (socket, next) => {
    console.log('--- Socket Auth Check Initiated ---');
    let token;

  
    if (socket.handshake.query && socket.handshake.query.token) {
        token = socket.handshake.query.token;
        // token source detected (query) — do not log token value
        console.log('Token source: query (value redacted)');
    } 
    
    else if (socket.handshake.headers.cookie) {
        const cookieHeader = socket.handshake.headers.cookie;
        const tokenCookie = cookieHeader.split(';').find(c => c.trim().startsWith('token=')); 

        if (tokenCookie) {
            token = tokenCookie.split('=')[1];
            // token source detected (cookie) — do not log token value
            console.log('Token source: cookie (value redacted)');
        }
    }

  
    if (!token) {
        console.log('Socket Auth Failed: token not provided');
        return next(new Error('Authentication failed: Token not provided.'));
    }
   
    try {
        // don't log the raw token in production logs — redact it
        console.log('Token received for verification: [REDACTED]');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(new Error('Authentication failed: User not found.'));
        }
        
    socket.user = currentUser;
    // log only non-sensitive identifiers
    console.log('Socket Auth Success for userId:', socket.user.id, 'socketId:', socket.id);
        next();
        
    } catch (err) {
        console.error('JWT Verification FAILED:', err.message);
        next(new Error('Authentication failed: Invalid Token or expired.'));
    }
};