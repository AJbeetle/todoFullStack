# FullStack Todo Website

This is a **FullStack Todo Website** built using **Node.js, Express, JWT for authentication, and file system as a database**. The frontend uses **plain HTML, CSS, and vanilla JavaScript (DOM manipulation)**.

## Project Structure
```
todoFullStack/
│── backend/
│   ├── node_modules/
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js   (Backend Server)
│   ├── todo.json   (user-specific todo storage) 
│
│── frontend/
│   ├── index.html  (Main frontend UI)
│   ├── pen.png
│   ├── remove.png
│   ├── scripts.js   (Handles DOM manipulation and API calls)
│   ├── style.css    (Styling)
│
│── .gitignore
│── authKey
│── authKey.pub
```

## 🛠️ Technologies Used

- 🎨 **Frontend:** HTML, CSS, JavaScript (DOM Manipulation)  
- 🏗️ **Backend:** Node.js, Express.js  
- 🗄️ **Database:** File System (`todo.json` as a database)  
- 🔑 **Authentication:** JWT (JSON Web Token)  


## Installation and Setup

### 1. Clone the Repository
```sh
git clone https://github.com/AJbeetle/todoFullStack.git 
cd todoFullStack
```

### 2. Install Dependencies for Backend
```sh
cd backend
npm install
```

### 3. Start the Backend Server
```sh
npm run  
```
The backend will run on **http://localhost:3000**

### 4. Start the Frontend Server
Navigate to the frontend folder and start the server using `npx serve`:
```sh
cd frontend
npx serve -p 4000
```
The frontend will be available at **http://localhost:4000**

## 🚀 API Endpoints

### 🔐 Authentication
- **`POST /signup`** → Register a new user  
- **`POST /signin`** → Login and receive JWT token  

### ✅ Todo Operations
- **`GET /view`** → Fetch user's todos  
- **`POST /add`** → Add a new todo  
- **`PUT /update`** → Update a todo  
- **`DELETE /delete`** → Remove a todo  


## 🚀 Features  
✔️ **User-Specific Todos** (Each user has their own list)  
✔️ **JWT Authentication** for secure login/logout  
✔️ **CRUD Operations** (Create, Read, Update, Delete Todos)  
✔️ **Express.js Server** handling API routes  
✔️ **DOM Manipulation** for Dynamic Content  
✔️ **File System-Based Database** (JSON File)  
✔️ **Separate Frontend & Backend** on Different Ports  


## 🚀 Future Improvements
- 🔄 Migrate from **file system** to **MongoDB or SQL** for better scalability.  
- ⚛️ Add **React.js or Vue.js** for a more dynamic UI.  
- 🔐 Implement **user roles and permissions** for better access control.  
- 🎨 Enhance UI/UX with better styling and animations.  



## Author
👤 **AAYUSHI JOSHI**  
📧 Contact: [aayushiJoshi](mailto:aayushijoshi9910@gmail.com)

---
Happy Coding! 🚀
