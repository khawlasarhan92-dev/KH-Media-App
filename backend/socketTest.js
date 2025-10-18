const io = require('socket.io-client');
const axios = require('axios'); 

// read test tokens from environment v hardcoding secrets in repoariables to avoid
const TOKEN_A_RECEIVER = process.env.TEST_TOKEN_A;
const TOKEN_B_SENDER = process.env.TEST_TOKEN_B;

const SERVER_URL = 'http://localhost:8000';
const POST_ID = '68dfb0551e9816bbb1a75d8a'; 




function setupReceiver(token) {
    console.log('--- Setting up RECEIVER (User A) ---');
  
    const socket = io(SERVER_URL, {
        query: { token: token },
        transports: ['websocket'] 
    });

    socket.on('connect', () => {
        console.log(`✅ User A (Receiver) connected. Socket ID: ${socket.id}`);
    });

    socket.on('connect_error', (err) => {
        console.error('❌ User A Connect Error:', err.message);
    });

   
    socket.on('newNotification', (data) => {
        console.log('\n🎉🎉🎉 NOTIFICATION RECEIVED (User A) 🎉🎉🎉');
        // print only safe parts of data
        try {
            const summary = {
                type: data && data.type ? data.type : 'unknown',
                from: data && data.from ? data.from : undefined,
                createdAt: data && data.createdAt ? data.createdAt : undefined,
            };
            console.log('Notification summary:', summary);
        } catch (e) {
            console.log('Notification received');
        }
       
    });
}


async function setupSenderAndSendComment(token) {
    console.log('\n--- Setting up SENDER (User B) ---');

   
    const socket = io(SERVER_URL, {
        query: { token: token },
        transports: ['websocket'] 
    });

    socket.on('connect', async () => {
        console.log(`✅ User B (Sender) connected. Socket ID: ${socket.id}`);
        
       
    console.log('Sending POST request to add comment...');
        try {
            await axios.post(
                `${SERVER_URL}/api/v1/posts/comment/${POST_ID}`,
                { text: `تعليق اختبار من Node.js في ${new Date().toLocaleTimeString()}` },
                {
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    }
                }
            );
            console.log('Successfully sent comment request (check Server Terminal for logs!)');
        } catch (err) {
            console.error('❌ AXIOS ERROR (Comment Request Failed):', err.response?.data?.message || err.message);
        }
    });

    socket.on('connect_error', (err) => {
        console.error('❌ User B Connect Error:', err.message);
    });
}


// 3. تشغيل الاختبار
setupReceiver(TOKEN_A_RECEIVER);
setupSenderAndSendComment(TOKEN_B_SENDER);