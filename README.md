# 📝 AI-Powered Task Manager

A **Kanban-style Task Manager** built with **Next.js, Redux Toolkit, Express, MongoDB, and Shadcn UI**.  
Includes **AI-powered task summarization** with OpenAI, allowing users to generate project status reports.

---

## ✨ Features

### 🔹 Core Task Management
- Create, edit, update, and delete tasks
- Drag & drop between **Todo → In Progress → Done**
- Persistent state stored in MongoDB
- Real-time task status updates
- Beautiful responsive Kanban board (Trello-like)

### 🔹 AI Features
- **AI Project Summarizer** ✨  
  - Summarizes all tasks into a **short status report** using OpenAI  
  - Markdown-formatted output with **bold headings, bullet points, and italics**  
  - Animated **typing effect** (stream-like feel)
- Future AI roadmap:
  - 🧠 Smart task creation from short prompts
  - 📊 Auto-prioritization & deadline estimation
  - 🔍 Duplicate detection
  - 🤖 Natural language task commands

### 🔹 UI/UX
- Built with **Shadcn UI + TailwindCSS**
- Dark theme support
- Responsive layout with **horizontal scroll on mobile**
- Loading states with **skeletons**
- Error handling with **wifi-off placeholder**

---

## 🛠️ Tech Stack

### **Frontend**
- [Next.js 14+](https://nextjs.org/) (App Router)
- [Redux Toolkit](https://redux-toolkit.js.org/) (state management)
- [Shadcn UI](https://ui.shadcn.com/) + [TailwindCSS](https://tailwindcss.com/) (UI components & styling)
- [React Markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) (Markdown rendering)
- [Lucide Icons](https://lucide.dev/) (icons)
- [Sonner](https://sonner.emilkowal.ski/) (toast notifications)

### **Backend**
- [Express.js](https://expressjs.com/) (REST API)
- [MongoDB + Mongoose](https://mongoosejs.com/) (database & schema)
- REST APIs for CRUD (`/tasks`, `/tasks/:id`, `/tasks/:id/status`)

### **AI**
- [OpenAI GPT-4o-mini](https://platform.openai.com/) (summarization model)
- Markdown + streaming typing effect for AI responses

### **Deployment**
- Frontend → [Vercel](https://vercel.com/)
- Backend → [Render](https://render.com/) / [Railway](https://railway.app/) / [Heroku](https://www.heroku.com/) (any Node host)
- MongoDB → [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 📂 Project Structure
.
├── frontend/ # Next.js + Redux Toolkit app
│ ├── app/ # Next.js App Router pages
│ ├── components/ # UI components (TaskCard, TaskColumn, dialogs)
│ ├── store/ # Redux slices (tasksSlice, hooks)
│ └── ...
│
├── backend/ # Express API
│ ├── models/Task.js # Mongoose schema
│ ├── routes/tasks.js # CRUD routes
│ └── server.js # Express entry
│
└── README.md
