## 🌍 Miles n Memories - Travel Journal Backend

A powerful **Node.js + Express** backend for a personal **Travel Journal App**, where users can record trips, upload images, and capture memories.  
Built with **MongoDB**, **JWT authentication**, and clean modular architecture.

---

## 🧰 Tech Stack

- ⚡ **Node.js + Express**
- 🗄️ **MongoDB (Mongoose)**
- 🔐 **JWT Authentication**
- 🧱 **bcryptjs** for password hashing
- 🧾 **express-validator** for validation
- 📸 **multer** for image uploads
- 🕓 **dayjs** for date handling
- 🌎 **CORS** for frontend-backend communication
- ⚙️ **dotenv** for environment configuration

---

## ⚙️ Setup Instructions

### 1️⃣ Initialize the project

```bash
npm init -y

```

### 2️⃣ Install dependencies

```bash
npm i express mongoose dotenv cors
npm i express-validator bcryptjs jsonwebtoken
npm i multer
npm install dayjs

```
- 🗂️ Project Structure

![alt text](<Screenshot 2025-10-17 155941.png>)



- 🔑 Environment Variables (.env)

    - Create a .env file in the backend folder:

```
PORT=3000
mongoURI=your_mongodb_connection_string
jwtSecret=your_secret_key

```
🌱 Database Seeding

Preload the database with user and story data for testing.

🧾 Data files

Located in utilities/:

storiesData.mjs

userData.mjs

🌿 Seed script

utilities/seedScript.mjs handles database seeding.

▶️ Run the seed script

```bash
node utilities/seedScript.mjs
```
This will:

Connect to MongoDB

Clear existing users & stories

Insert new seed data

Automatically link stories with users

🚀 Running the Server

Start the backend in development mode:

```bash
npm run dev
```

(package.json must include "dev": "nodemon server.mjs" under scripts)

🔐 API Routes

👤 User Routes

| Method | Route                  | Description                          | 
| ------ | -----------------------| -------------------------------------|
| GET    | `/api/user/register`   | Register a new user                  |                              
| POST   | `/api/user/login`      | Log in a user                        |                              
| GET    | `/api/user/profile`    | Get logged-in user info (requires token)|                             


🗺️ Story Routes

| Method | Route                  | Description                         | 
| ------ | -----------------------| ------------------------------------|
| GET    | `/api/story/`          | Get all user stories                |                              
| POST   | `/api/story/`          | Create a new story                  |                              
| GET    | `/api/story/:id`       | Get a specific story by story Id    |                              
| PUT    | `/api/story/:id`       | Update a story by story Id          |                              
| DELETE | `/api/story/:id`       | Delete a story by story Id          |                              


🖼️ Image Routes

| Method | Route                  | Description                          | 
| ------ | -----------------------| -------------------------------------|
| POST   | `/api/image/`          | Upload an image                      |                              
| DELETE | `/api/image/`          | Delete an image                      |                              


🧱 Middleware

🔒 userAuth.mjs

Extracts and verifies JWT tokens from headers

Confirms user validity in the database

Protects routes like api/user/profile and api/story

🖼️ imageAuth.mjs

Handles file uploads with Multer

Validates image types

Saves uploaded images to the defined path

### Requirement

- Backend/Server:
    - ✅Connect to your DB
    - Effective Error Handling
    - ✅C.R.U.D capabilities
    - Documentation:
    - ✅Well documented readme
    - ✅Full Commit history, 25 commits- ish
        - Extra Credit:
    - ✅using JIRA  1%
    - ✅authentication 2%


🛠️ Developed by Nidhi Goyal


