# AI Learning App - React Native

A React Native mobile application that integrates with your backend API for essay correction and pronunciation practice.

## Features

- **Essay Corrector**: Submit essays for AI-powered evaluation and feedback
- **Pronunciation Practice**: Look up word pronunciations and get random words
- **Auto Authentication**: Automatic user registration and JWT token management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Your backend server running on `http://localhost:3000`

## Installation

1. Navigate to the mobile-app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### API Endpoint Setup

Edit `src/config/api.js` to configure your API endpoint:

- For iOS Simulator: Use `http://localhost:3000/api/v1/ai`
- For Android Emulator: Use `http://10.0.2.2:3000/api/v1/ai`
- For Physical Device: Use your computer's IP address (e.g., `http://192.168.1.100:3000/api/v1/ai`)

To find your IP address:
- Windows: Run `ipconfig` in CMD
- Mac/Linux: Run `ifconfig` or `ip addr`

## Running the App

1. Start the Expo development server:
```bash
npm start
```

2. Choose your platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## Project Structure

```
mobile-app/
├── src/
│   ├── config/
│   │   └── api.js              # API configuration
│   ├── services/
│   │   └── api.js              # API service functions
│   ├── screens/
│   │   ├── HomeScreen.js       # Home screen
│   │   ├── EssayCorrectorScreen.js
│   │   └── PronunciationScreen.js
│   └── navigation/
│       └── AppNavigator.js     # Navigation setup
├── App.js                      # Main app component
├── package.json
└── app.json
```

## API Endpoints Used

- `POST /api/v1/ai/` - User registration and authentication
- `POST /api/v1/ai/ai/evaluation` - Essay evaluation
- `POST /api/v1/ai/pronountion/send` - Word pronunciation lookup
- `GET /api/v1/ai/get-on-define` - Get random word

## Troubleshooting

### Cannot connect to backend

1. Make sure your backend server is running
2. Update the API_BASE_URL in `src/config/api.js` with the correct IP address
3. Ensure your device/emulator is on the same network as your backend server

### Authentication errors

The app automatically creates a user account on first launch. If you encounter auth errors, try clearing the app data or reinstalling.

## Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

Note: You'll need an Expo account for building production apps.
