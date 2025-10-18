const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const userRoutes = require('./routes/userRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const notificationsRoutes = require('./routes/notificationsRoutes.js');
const searchRoutes = require('./routes/searchRoutes.js'); 
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

app.use('/', express.static('uploads'));
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000',
     'https://kh-media-app.pages.dev'], 
  credentials: true,
}));
// Welcome route for root
app.get('/', (req, res) => {
  res.send('KH-Media-App API is running!');
});
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());

// Debug route to read email logs (development or localhost only)
const emailLogger = require('./utils/emailLogger');
app.get('/debug/email-logs', (req, res) => {
  const isLocal = req.ip === '::1' || req.ip === '127.0.0.1' || req.hostname === 'localhost';
  if (process.env.NODE_ENV !== 'development' && !isLocal) {
    return res.status(403).json({ status: 'fail', message: 'Not allowed' });
  }
  const content = emailLogger.readLastLines(200);
  res.type('text/plain').send(content || 'No email logs');
});

// Debug route to return a small parsed status (counts and last entries)
app.get('/debug/email-status', (req, res) => {
  const isLocal = req.ip === '::1' || req.ip === '127.0.0.1' || req.hostname === 'localhost';
  if (process.env.NODE_ENV !== 'development' && !isLocal) {
    return res.status(403).json({ status: 'fail', message: 'Not allowed' });
  }
  const raw = emailLogger.readLastLines(500);
  if (!raw) return res.json({ status: 'success', counts: {}, last: [] });
  const lines = raw.trim().split(/\r?\n/).map(l => {
    try { return JSON.parse(l.replace(/^\[[^\]]+\]\s*/, '')); } catch (e) { return { raw: l }; }
  });
  const counts = lines.reduce((acc, cur) => {
    const ev = cur.event || (cur.raw ? 'raw' : 'unknown');
    acc[ev] = (acc[ev] || 0) + 1;
    return acc;
  }, {});
  res.json({ status: 'success', counts, last: lines.slice(-20) });
});

app.use('/api/v1/users' , userRoutes);
app.use('/api/v1/posts' , postRoutes);
app.use('/api/v1/notifications' , notificationsRoutes);
app.use('/api/v1/search' , searchRoutes);
app.use('/api/v1/chats' , chatRoutes);
app.use('/api/v1/messages' , messageRoutes);
app.use('/api/v1/auth' , authRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;