# Chat X - Premium AI Chatbot

A modern, full-stack AI chatbot application built with React, Tailwind CSS, Framer Motion, and Firebase, powered by Google's Gemini AI.

## 🚀 Features

- **Real-time AI Chat**: Powered by Gemini 3 Flash for fast, intelligent responses.
- **Streaming UI**: Experience the "typing" effect as the AI generates responses.
- **Chat History**: Your conversations are securely stored and synced across devices.
- **Glassmorphism UI**: A beautiful, modern interface with backdrop blurs and smooth transitions.
- **Markdown Support**: Full support for code blocks (with syntax highlighting), lists, and formatting.
- **Responsive Design**: Seamless experience on both desktop and mobile.
- **Google Authentication**: Secure login with your Google account.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Firebase (Firestore, Authentication).
- **AI**: Google Generative AI (Gemini).
- **Utilities**: clsx, tailwind-merge, date-fns, react-markdown.

## ⚙️ Setup Instructions

1. **Clone the repository** (or copy the files).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. **Firebase Setup**:
   - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** with Google as a provider.
   - Create a **Firestore Database**.
   - Copy your Firebase configuration and update `src/firebase-applet-config.json`.
5. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🔐 Security

- API keys are stored in environment variables and never exposed in public repositories.
- Firestore Security Rules ensure that users can only access their own chat history.
- Input validation is handled both on the client and through Firestore rules.

## 📱 Mobile Experience

- Collapsible sidebar for maximum chat space.
- Optimized touch targets.
- Keyboard-aware input field.

---

Built with ❤️ using Google AI Studio.
