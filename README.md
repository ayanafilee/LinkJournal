# 📔 LinkJournal - Your Digital Vault

LinkJournal is a premium, full-stack digital archiving platform designed to help users organize, categorize, and preserve their digital lives. Built with a focus on high-end aesthetics and seamless user experience, it allows for sophisticated link management with topic-based categorization.

---

## ✨ Features

- **Topic-Based Organization**: Group your links into meaningful topics for clear navigation.
- **Smart Journaling**: Add detailed descriptions and context to every link you save.
- **Advanced Authentication**: Secure login via Email/Password or **Google One-Tap**.
- **Priority Management**: Star important journals to keep them at the top of your workspace.
- **Modern Search**: Integrated search functionality that adapts to your current navigation context (Topics or Journals).
- **Premium UI/UX**: Professional Blue & Slate design system with Glassmorphism, smooth animations, and responsive layouts.
- **Instant Sync**: Real-time database synchronization between Firebase Auth and MongoDB.

---
## 🛠️ Screenshots
<img width="1900" height="870" alt="image" src="https://github.com/user-attachments/assets/14499bde-2a78-4c5c-8af1-2df4a3402f4d" />
<img width="1887" height="879" alt="image" src="https://github.com/user-attachments/assets/bb0433bb-adba-4063-982d-6a4d6f040bee" />



## 🛠️ Tech Stack

### Frontend (Modern Web)
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router & Server Actions)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Design System)
- **Authentication**: [Firebase Client SDK](https://firebase.google.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toast Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Backend (Performance First)
- **Language**: [Go (Golang)](https://go.dev/)
- **Web Framework**: [Gin Gonic](https://gin-gonic.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Atomic transactions & flexible schema)
- **Security**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) (Token validation & profile management)
- **Environment**: [Godotenv](https://github.com/joho/godotenv)

---

## ⚙️ Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_API_URL=http://localhost:8080/api # Local or Deployment URL
```

### Backend (`.env`)
```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=linkjournal
PORT=8080
FIREBASE_CREDENTIALS_PATH=serviceAccountKey.json
```

---

## 🚀 Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/LinkJournal.git
cd LinkJournal
```

### 2. Setup Backend
```bash
cd linkjournal_backend
go mod tidy
go run main.go
```

### 3. Setup Frontend
```bash
cd linkjournal_frontend
npm install
npm run dev
```

---

## 🤖 Designed & Developed by Antigravity (Gemini)

This project features code architecture and UI design crafted through an advanced agentic coding workflow. 

**Key Collaborative Tools Used:**
- **Antigravity (Gemini 2.0)**: The primary architect and pair programmer, responsible for implementing the global design system, complex state management logic, and backend security layers.
- **Agentic Workflows**: Used for automated debugging, syntax fixing, and visual consistency checks during the "Premium UI Overhaul."
- **Next.js & Go Integration**: Optimized communication between a high-performance Golang API and a reactive Next.js frontend using RTK Query for caching and invalidation.

---

## 🌐 Deployment

The frontend is optimized for **Vercel** deployment.
The backend can be hosted on **Render**, **Railway**, or **Fly.io**.

*Note: Ensure you add your Vercel deployment URL to the **Authorized Domains** list in the Firebase Console to enable Google Login.*

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
