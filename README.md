# Feedback Portal

A modern web application for collecting and managing user feedback. Built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

- User authentication (email/password and Google sign-in)
- Feedback submission form with validation
- Admin panel to view submitted feedback
- Dark/light mode toggle
- Responsive design for mobile and desktop
- Real-time data updates via Firebase

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Backend/Database**: Firebase (Authentication, Firestore, Storage)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Project Structure

```
/
├── public/              # Static assets
│   └── index.html       # HTML entry point
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # React components
│   ├── contexts/        # React context providers
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   ├── firebase.ts      # Firebase configuration
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global CSS
├── .env.example         # Example environment variables
└── vite.config.ts       # Vite configuration
```

## Environment Setup

1. Clone the repository
2. Create a `.env` file in the root directory with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Building for Production

1. Create a production build:
   ```
   npm run build
   ```

2. Preview the production build:
   ```
   npm run preview
   ```

## Deployment

1. Set up a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage services
3. Update your Firestore rules as needed
4. Deploy using Firebase Hosting:
   ```
   npm install -g firebase-tools
   firebase login
   firebase init
   firebase deploy
   ```

## Firebase Configuration

This project uses Firebase for authentication, database, and storage. The configuration is stored in environment variables for security. Make sure to update the `.env` file with your Firebase project details.

## License

MIT
