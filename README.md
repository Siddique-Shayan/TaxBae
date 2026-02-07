### TaxBae

## Project Setup Guide

This project consists of two parts:

Client (Frontend)

Server (Backend)

You’ll need to run both simultaneously using two separate terminals.

📦 Prerequisites

Before getting started, make sure you have:

Node.js (v18+ recommended)

npm

MongoDB (local or cloud)

API keys for:

Gemini

Cloudinary

Resend

## 🖥️ Client Setup (Frontend)

Open a terminal and navigate to the client folder.

# 1️⃣ Install Dependencies
```
npm fix --force
npm install
```

# 2️⃣ Environment Variables

Create a .env file inside the client folder only and add:

```
VITE_API_URL=http://localhost:8000/api
```


⚠️ Important:
The .env file must be placed strictly inside the client folder, not in the root or any other directory.

# 3️⃣ Start the Client
```
npm run dev
```


The frontend will typically run on:
👉 http://localhost:5173

## 🛠️ Server Setup (Backend)

Open a second terminal and navigate to the backend folder.

#1️⃣ Install Dependencies
```
npm install
```

#2️⃣ Environment Variables

Create a .env file inside the backend folder and add the following:

```
NODE_ENV=development
PORT=8000
BASE_PATH=/api

JWT_SECRET=TaxBae
JWT_EXPIRES_IN=45m

JWT_REFRESH_SECRET=OPTaxbae
JWT_REFRESH_EXPIRES_IN=7d

MONGO_URI=YOUR_MONGO_URL
GEMINI_API_KEY=YOUR_GEMINI_KEY

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUD_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUD_API_SECRET

RESEND_API_KEY=YOUR_RESEND_API_KEY
RESEND_MAILER_SENDER=YOUR_EMAIL_ID

FRONTEND_ORIGIN=http://localhost:5173
```

🔐 Note:
Replace all YOUR_... values with your actual credentials.

#3️⃣ Start the Server
```
npm run dev
```

The backend will run on:
👉 http://localhost:8000

✅ Running the Project

Make sure:

Client is running on port 5173

Server is running on port 8000

Both .env files are correctly placed

Once both are running, the frontend should successfully communicate with the backend 🎉

## 🧠 Common Issues

❌ API not connecting?
→ Check VITE_API_URL and FRONTEND_ORIGIN

❌ Environment variables not loading?
→ Restart the dev servers

❌ MongoDB errors?
→ Verify MONGO_URI