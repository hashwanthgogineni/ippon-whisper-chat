# Firebase Setup for Ippon Whisper

## Quick Setup Instructions

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Name it "ippon-whisper" (or your preferred name)
   - Enable Google Analytics (optional)

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication"
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password"
   - Enable "Google" (add your project domains)

3. **Create Firestore Database**
   - Go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select your preferred location

4. **Get Configuration**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click "Add app" > Web app
   - Register your app
   - Copy the configuration object

5. **Update Configuration**
   - Replace the config in `src/lib/firebase.ts` with your actual config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## Firestore Security Rules (Production)

When ready for production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow update: if request.auth != null 
        && (request.auth.uid == resource.data.userId 
            || request.auth.uid in resource.data.likes);
    }
  }
}
```

## Backend Integration

For backend integration, you'll need to set up your Flask backend separately:

1. Create a Python virtual environment
2. Install required packages (Flask, Firebase Admin SDK, etc.)
3. Set up REST API endpoints for posts, comments, likes
4. Deploy to Render or similar platform
5. Update API calls in the frontend to use your backend URL

## Features Ready to Use

✅ Firebase Authentication (Email + Google)  
✅ Real-time posts feed  
✅ Like/Unlike functionality  
✅ Comments system  
✅ Dynamic leaderboard  
✅ Light/Dark mode toggle  
✅ Responsive design  
✅ Beautiful Facebook-inspired UI

## Next Steps for Decentralization

- Add IPFS integration for message storage
- Implement token tipping with ethers.js
- Connect to Polygon testnet
- Add Web3 wallet integration