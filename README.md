# 🗳️ Voting Application (Backend Only)

## 1. About the Project

This project is a **backend-only** implementation of a voting system where users can register, log in, and cast votes for candidates. It focuses on building secure APIs using **Node.js**, **Express.js**, and **MongoDB (Mongoose)**, while enforcing proper authentication and authorization.

The application includes an **admin** role for managing candidates and a **user** role for voting.

---

## 2. Functionality

### 👤 User Features
- **Sign Up / Sign In** using **Aadhar card number** and password  
- **View all candidates** available for voting  
- **Vote for one candidate only** (cannot vote again)  
- **View own profile** and **change password**

### 🧑‍💼 Admin Features
- **Add / Update / Delete candidates**
- Cannot vote

### ⚙️ General
- **Live vote counts** sorted by number of votes  
- **Unique government ID (Aadhar)** per user  
- **Authentication** and **Authorization** enforced with JWT  

---

## 3. Tech Stack

| Tool | Purpose |
|------|----------|
| **Node.js** | Backend runtime environment |
| **Express.js** | Web framework for creating routes and APIs |
| **MongoDB** | Database for storing users, candidates, and votes |
| **Mongoose** | ODM for MongoDB |
| **VS Code (or any IDE)** | Code editor |
| **Postman** | API testing tool |

---

## 4. Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or above)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [VS Code](https://code.visualstudio.com/) (or any text editor)
- [Postman](https://www.postman.com/downloads/) for API testing

---

## 5. Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/voting-app.git
cd voting-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment Variables
Create a `.env` file in the project root and add the following:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/votingApp
JWT_SECRET=yourSecretKey
```

### Step 4: Start MongoDB
If MongoDB is running locally:
```bash
mongod
```

### Step 5: Run the Application
```bash
npm start
```
Server will start on:
```
http://localhost:5000
```

---

## 6. Routes (APIs)

### 1) **User Authentication**
| Method | Route | Description |
|--------|--------|-------------|
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Log in using Aadhar number & password |

---

### 2) **Voting**
| Method | Route | Description |
|--------|--------|-------------|
| `GET` | `/candidates` | View all candidates |
| `POST` | `/vote/:candidateId` | Vote for a specific candidate |

---

### 3) **Vote Counts**
| Method | Route | Description |
|--------|--------|-------------|
| `GET` | `/vote/counts` | Get live vote counts (sorted) |

---

### 4) **User Profile**
| Method | Route | Description |
|--------|--------|-------------|
| `GET` | `/profile` | Get logged-in user's profile |
| `PUT` | `/profile/password` | Change password |

---

### 5) **Admin Candidate Management**
| Method | Route | Description |
|--------|--------|-------------|
| `POST` | `/candidates` | Add new candidate (**Admin only**) |
| `PUT` | `/candidates/:candidateId` | Update candidate (**Admin only**) |
| `DELETE` | `/candidates/:candidateId` | Delete candidate (**Admin only**) |

---

### 6) **Additional Route**
| Method | Route | Description |
|--------|--------|-------------|
| `GET` | `/user/all` | Fetch all registered users (for debugging/admin view) |

---

## 7. Testing in Postman

### Step 1: Open Postman  
Download and open **Postman**.

### Step 2: Create a New Request  
- Click **New → HTTP Request**  
- Enter the URL (e.g. `http://localhost:5000/signup`)  
- Select method (`POST`, `GET`, etc.)  
- Add **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer <your_JWT_token>   // only for protected routes
  ```

### Step 3: Example Requests

#### ➤ Signup (POST)
**URL:** `http://localhost:5000/signup`  
**Body (JSON):**
```json
{
  "name": "John Doe",
  "aadhar": "123456789012",
  "password": "password123",
  "role": "user"
}
```

#### ➤ Login (POST)
**URL:** `http://localhost:5000/login`  
**Body (JSON):**
```json
{
  "aadhar": "123456789012",
  "password": "password123"
}
```
**Response:** will include a JWT token.

#### ➤ Get All Users (GET)
**URL:** `http://localhost:5000/user/all`  
**Headers:**
```
Authorization: Bearer <JWT_token>
```

#### ➤ Vote (POST)
**URL:** `http://localhost:5000/vote/<candidateId>`

---

## 8. Notes
- Make sure MongoDB is running before starting the server.
- Protected routes require a valid **JWT token** (returned from `/login`).
- Admin users should be manually assigned via database if not handled via signup.
