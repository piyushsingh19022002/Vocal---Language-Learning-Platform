# Google OAuth Setup Guide

## How Google Sign-In Works

1. **User clicks "Continue with Google" button**
2. **Google opens a popup/window** asking user to select their Google account
3. **User selects account** and grants permission
4. **Google returns a JWT token** (credential) containing user info
5. **Frontend sends token to backend** (`/api/auth/google`)
6. **Backend verifies token** and extracts user info (email, name, picture)
7. **Backend creates/finds user** in database
8. **Backend returns JWT token** for your app
9. **User is logged in** and redirected to dashboard

## Setup Instructions

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** or **Google Identity Services**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
7. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
8. Copy the **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)

### Step 2: Add Client ID to Environment Variables

#### For Frontend (client folder):

Create or update `.env` file in the `client` folder:

```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

#### For Backend (optional, if you want to verify tokens):

Create or update `.env` file in the root folder:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### Step 3: Restart Your Development Server

After adding the environment variable, restart both:
- Frontend server (`npm start` in client folder)
- Backend server (`npm start` in root folder)

## Testing

1. Go to login or signup page
2. Click "Continue with Google" button
3. Select your Google account
4. Grant permissions
5. You should be logged in and redirected to dashboard

## Troubleshooting

### "Google Client ID is not configured"
- Make sure you added `REACT_APP_GOOGLE_CLIENT_ID` to `.env` file in `client` folder
- Restart the frontend server
- Check that the variable name is exactly `REACT_APP_GOOGLE_CLIENT_ID`

### "Google sign in is not available"
- Check your internet connection
- Make sure the Google script loaded (check browser console)
- Try refreshing the page

### "Invalid Google token"
- Make sure your Google Client ID is correct
- Check that authorized origins match your current URL
- For production, make sure you're using HTTPS

## Security Notes

- **Never commit** your `.env` files to git
- The current implementation decodes the JWT token without verification (for development)
- For production, you should verify the token with Google's public keys using `google-auth-library` npm package

