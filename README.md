# Cyber Guard - SOC Platform

## **Overview**
Cyber Guard is a web-based **Security Operations Center (SOC) platform** designed to provide **secure file analysis, incident management, and user authentication.** The platform integrates with **VirusTotal API** to analyze potentially malicious files without executing them.

## **Tech Stack**

- **Frontend:** React.js (Vite) + Shadcn/UI + TailwindCSS
- **Backend:** Express.js (Node.js)
- **Database:** MongoDB
- **Authentication:** JWT + Google OAuth (Firebase)
- **State Management:** Redux Toolkit
- **File Handling:** Multer
- **File Analysis:** VirusTotal API

## **Features**

### **1. File Analysis**
- Static analysis of **executables, DLLs, PDFs**
- **VirusTotal API integration** for malware detection
- **Detailed scan reports** with threat detection results
- **Excel report generation**

### **2. User Management**
- **User authentication** (Email/Password & Google OAuth)
- **Role-based access control** (Admin/User)
- **Profile management**

### **3. Incident Management**
- **Incident reporting and tracking**
- **Report generation**
- **User notifications**

## **Project Structure**

### **Frontend (React + Vite)**
```yaml
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── redux/          # State management
│   ├── context/        # React context providers
│   ├── lib/            # Utility functions
│   └── components/ui/  # Shadcn UI components
```

### **Backend (Express + MongoDB)**
```yaml
api/
├── controllers/    # Request handlers
├── models/        # MongoDB schemas
├── routes/        # API endpoints
└── utils/         # Helper functions
```

## **Setup Instructions**

### **Prerequisites**
- Node.js v16+
- MongoDB installed & running
- Firebase project (for Google OAuth)
- VirusTotal API key

### **Installation Steps**

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cyber-guard
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   ```

3. **Set up environment variables:**

   Create **.env** file in the root directory:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   VIRUSTOTAL_API_KEY=<your-virustotal-api-key>
   ```
   
   Create **.env** file in the `client/` directory:
   ```env
   VITE_FIREBASE_API_KEY=<your-firebase-api-key>
   VITE_REACT_APP_BACKEND_URL=http://localhost:3000
   ```

4. **Start development servers:**
   ```bash
   # Start backend server
   npm run dev

   # Start frontend development server
   cd client
   npm run dev
   ```

## **API Documentation**

### **Authentication Endpoints**
```http
POST /api/auth/signup  # Register a new user
POST /api/auth/signin  # User login
POST /api/auth/google  # Google OAuth authentication
```

### **User Management Endpoints**
```http
PUT /api/user/update/:userId  # Update user profile (Protected)
DELETE /api/user/delete/:userId  # Delete user account (Protected)
POST /api/user/signout  # Sign out user
```

### **File Analysis Endpoints**
```http
POST /api/upload  # Upload file for analysis (Protected)
```

## **Authentication Flow**

### **Traditional Authentication (JWT)**
1. User submits login credentials.
2. Server validates credentials.
3. Generates a **JWT token**.
4. Stores token in **HTTP-only cookie**.
5. Updates user state in Redux.

### **Google OAuth Authentication**
1. User clicks **Google sign-in**.
2. Firebase handles OAuth flow.
3. Server creates/updates user.
4. Generates **JWT token**.
5. Updates user state.

## **Security Considerations**

### **1. Authentication Security**
- HTTP-only **cookies for JWT**
- **Bcrypt password hashing**
- **Role-based access control** (RBAC)

### **2. File Upload Security**
- **File type validation** (Block malicious formats)
- **Size limitations**
- **No direct file execution**

### **3. API Security**
- **CORS configuration**
- **Rate limiting**
- **Input validation & error handling**

## **Contributing**

We welcome contributions! Please follow these steps:
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature-name`)
3. **Commit your changes** (`git commit -m "Add feature"`)
4. **Push to your branch** (`git push origin feature-name`)
5. **Create a Pull Request**

## **License**
This project is **open-source** and available under the **MIT License**.

---
🚀 **Cyber Guard** is built for security professionals to analyze files securely and manage incidents efficiently. Happy coding! 🎯
