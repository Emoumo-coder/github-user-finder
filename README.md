# GitHub User Finder 🔍

A beautiful and responsive GitHub user finder application built with React, TypeScript, and Material-UI. Search for GitHub users and explore their profiles and repositories with an elegant interface.

## ⚠️ Important: GitHub API Rate Limits

**Without a GitHub Token:**
- 🔴 **60 requests per hour** for unauthenticated API calls
- Limited to basic searches and demo usage
- Rate limits reset every hour

**With a GitHub Token:**
- 🟢 **5,000 requests per hour** for authenticated API calls
- Full access to all features
- Better reliability for frequent searches

## ✨ Features

### Core Features
- 🔍 Search GitHub users by username
- 👤 Display user profile information
- 📚 Show public repositories with details
- 🎨 Beautiful Material-UI design
- 📱 Fully responsive layout
- ⚡ Real-time search with debouncing
- 🔄 Loading states and error handling

### Bonus Features
- 🌙 Dark/Light mode toggle
- 💾 Search history with local storage
- 🔄 Infinite scroll for repositories
- ⚡ API response caching (5 minutes)
- 🎯 Debounced search (500ms)
- 📱 Mobile-first responsive design
- 🎨 Gradient backgrounds and smooth animations

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- (Recommended) GitHub Personal Access Token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Emoumo-coder/github-user-finder
cd github-user-finder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (Optional but Recommended):
```bash
# Create a .env file in the root directory
touch .env
```

Add your GitHub Personal Access Token to the `.env` file:
```env
VITE_GITHUB_TOKEN=your_github_personal_access_token_here
```

### 🔑 How to Get a GitHub Personal Access Token

1. **Go to GitHub Settings:**
   - Click your profile picture → **Settings**
   - Scroll down to **Developer settings**
   - Click **Personal access tokens** → **Tokens (classic)**

2. **Generate New Token:**
   - Click **Generate new token** → **Generate new token (classic)**
   - Give it a name like "GitHub User Finder"
   - **No permissions needed** (public read-only access is sufficient)
   - Set expiration (30-90 days recommended)
   - Click **Generate token**

3. **Copy and Use:**
   - **Copy the token immediately** (you won't see it again)
   - Add it to your `.env` file as shown above

4. **Start the development server:**
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Context API** for state management
- **Vite** for build tooling
- **GitHub REST API** for data
- **Custom Hooks** for debouncing and caching