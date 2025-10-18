# KH Media App 🌐

KH Media App is a robust, full-stack social media application engineered for **real-time interaction** and community building. Built with **Next.js (frontend)** and **Node.js/Express (backend)**, it offers a seamless, modern user experience with core features like real-time chat (Socket.io), dynamic post creation, and comprehensive profile management, all delivered through a responsive and elegant UI (Tailwind CSS).

---

## 📸 UI Preview

A quick look at the application's modern design:
 <img src="/readme-images/Home-screenShot.png" alt="Posts Feed" width="300">
<br><img src="/readme-images/real-time-chats.png" alt="Chat Real Time" width="300">

## Key Features

### Frontend (Next.js & Redux Toolkit)
- **Authentication Flow:** Complete user sign-up, login, password reset, and email verification.
- **Dynamic Content:** Create, edit, and delete text and image posts.
- **Real-Time Communication:** Live chat and messaging powered by Socket.io.
- **Notifications:** Receive immediate alerts for new messages, post interactions, and mentions.
- **Profile Management:** Edit profile details and manage personal post history.

### Backend (Node.js & Express.js)
- **Secure RESTful API:** Designed for scalability and easy integration.
- **JWT & Session Control:** Secure authentication and authorization using JSON Web Tokens.
- **Real-Time Engine:** Socket.io setup for handling live chat and notification events.
- **Data & Storage:** MongoDB (Mongoose) for structured data; File uploads managed by Multer and Cloudinary.
- **System Services:** Email service integration for critical flows (OTP, password reset).

---

## Technical Architecture & Core Technologies

| Technology | Purpose |
| :--- | :--- |
| **Frontend** | Next.js,TypeScrypt, React, Redux Toolkit, Axios, Tailwind CSS |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), Socket.io |
| **Authentication** | JWT (JSON Web Tokens) |
| **Storage** | Multer, Cloudinary (for file hosting) |
| **Notifications** | Sonner (for frontend toast notifications) |

---

## Technical Challenges & Solutions (Showcasing Expertise)

This project involved solving several complex technical challenges:

### 1. Preventing Duplicate Chat Creation (MongoDB E11000)
- **Issue:** Avoiding a `E11000 duplicate key error` when two users attempt to create the same 1-on-1 chat simultaneously.
- **Solution:** Implemented atomic checks and unique constraints on the chat members array in the backend to ensure chat existence is verified and handled gracefully before creation.

### 2. Real-Time Notifications and State Sync with Socket.io
- **Issue:** Ensuring immediate, consistent updates across all connected clients for likes, and interactions.
- **Solution:** Designed a dedicated notification model and established distinct Socket.io event emitters and listeners to manage notification distribution and sync with the frontend Redux store.

### 3. Graceful JWT Logout Handling
- **Issue:** Preventing technical errors (like "jwt malformed") in the frontend when a valid token is replaced by a "loggedout" marker during the sign-out process.
- **Solution:** Implemented robust backend middleware to specifically detect and handle invalid or logout-marked tokens, ensuring a smooth and error-free user experience.

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khawlasarhan92-dev/KH-Media-App.git
   cd media-app
   ```

2. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configuration:**
   - Create `.env` files in both `backend` and `frontend` folders.
   - Add required API keys, database URI, and other secrets (see `.env.example`).

### Email for portfolio / demo (recommended)

For portfolio demos we recommend using Mailtrap to capture outgoing emails instead of sending real mails. This prevents accidental emails to real users and makes it easy for reviewers to inspect OTPs and reset links.

- Quick guide:
	1. Create a Mailtrap account and a Sandbox inbox.
	2. Copy the SMTP credentials and paste them into `backend/.env` or into your host environment variables (see `backend/.env.example`).
	3. Start the backend and run `node backend/sendTestEmail.js` to verify delivery to Mailtrap.
	4. For step-by-step instructions see `backend/README-mailtrap.md`.


### Running the Application

| Script | Location | Command | Description |
| :--- | :--- | :--- | :--- |
| Backend Dev | `backend/` | `npm run dev` | Starts server with `nodemon` for development. |
| Frontend Dev | `frontend/` | `npm run dev` | Starts Next.js development server on [http://localhost:3000](http://localhost:3000). |
| Production Start | `backend/` | `npm start` | Starts the production server. |


---

## Future Roadmap (Next Steps)

- **Stories Feature:** Implement temporary image/video sharing, similar to modern platforms.
- **Advanced Search:** Integrate full-text search capabilities for efficient discovery of users and content.
- **Dark/Light Theme:** Add a user-toggleable option for improved accessibility and preference.
- **Admin Dashboard:** Develop a dedicated admin panel for monitoring and managing content/users.

---

## API Documentation

Key RESTful API endpoints:

| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Register** | `POST` | `/users/signup` | Create a new user account |
| **Login** | `POST` | `/users/login` | Authenticate and receive JWT |
| **Posts** | `GET` | `/posts` | Retrieve all posts |
| **New Post** | `POST` | `/posts` | Create a new post |
| **Chats** | `GET` | `/chats` | Get all user's conversations |
| **Send Message**| `POST` | `/messages` | Send a new message to a chat |

---

## Folder Structure

media-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── ...
├── frontend/
│   ├── app/
│   ├── components/
│   ├── store/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md


---

## Author & License

Developed by **Khawla Sarhan**.

This project is licensed under the **MIT License**.

---