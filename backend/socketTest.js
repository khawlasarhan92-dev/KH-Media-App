const io = require('socket.io-client');
const axios = require('axios'); // لإرسال طلب الـ Comment (اختياري)

// 🚨🚨 يجب تحديث هذين التوكنين بآخر توكنات صالحة 🚨🚨
const TOKEN_A_RECEIVER = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2FmZDNjNDE0ZmYwMTU0MjkyNmNlYiIsImlhdCI6MTc1OTUwNTA4MywiZXhwIjoxNzY3MjgxMDgzfQ.Y4LGIqrLEMObJq-RUgD7GAcHkRlK5UKGlKy_mJB67Qw'; // مالك المنشور
const TOKEN_B_SENDER = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2FmY2E5NDE0ZmYwMTU0MjkyNmNlOCIsImlhdCI6MTc1OTUwNTE0NSwiZXhwIjoxNzY3MjgxMTQ1fQ.awdQMMZssO9kMMpmQZKUkHGKolA8YmKOf3lBHEbrq54';  // المُعلق

const SERVER_URL = 'http://localhost:8000';
const POST_ID = '68dfb0551e9816bbb1a75d8a'; // ID المنشور الذي ستعلق عليه

// ------------------------------------------------------------------

// 1. إعداد المستخدم A (المستلم)
function setupReceiver(token) {
    console.log('--- Setting up RECEIVER (User A) ---');
    
    // إنشاء الاتصال مع تمرير التوكن في الـ Query
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

    // الاستماع لحدث الإشعار
    socket.on('newNotification', (data) => {
        console.log('\n🎉🎉🎉 NOTIFICATION RECEIVED (User A) 🎉🎉🎉');
        console.log('Data:', data);
        // يمكنك إيقاف البرنامج هنا إذا كنت تريد
        // process.exit(0); 
    });
}

// 2. إعداد المستخدم B (المرسل) وتشغيل التعليق
async function setupSenderAndSendComment(token) {
    console.log('\n--- Setting up SENDER (User B) ---');

    // إنشاء اتصال B للتأكد من انضمامه للغرفة
    const socket = io(SERVER_URL, {
        query: { token: token },
        transports: ['websocket'] 
    });

    socket.on('connect', async () => {
        console.log(`✅ User B (Sender) connected. Socket ID: ${socket.id}`);
        
        // 🚨 إرسال طلب التعليق بعد ثانية واحدة من الاتصال (محاكاة Postman)
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
            console.error('❌ AXIOS ERROR (Comment Request Failed):', err.response?.data || err.message);
        }
    });

    socket.on('connect_error', (err) => {
        console.error('❌ User B Connect Error:', err.message);
    });
}


// 3. تشغيل الاختبار
setupReceiver(TOKEN_A_RECEIVER);
setupSenderAndSendComment(TOKEN_B_SENDER);