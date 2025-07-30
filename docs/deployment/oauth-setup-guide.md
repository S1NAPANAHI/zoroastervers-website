# OAuth Setup Guide for Supabase

This guide will help you enable Google and Facebook OAuth providers in your Supabase project to fix the "Unsupported provider: provider is not enabled" errors.

## Prerequisites

- Access to your Supabase project dashboard
- Google Developer Console account (for Google OAuth)
- Facebook Developer account (for Facebook OAuth)

## Step 1: Enable OAuth Providers in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Settings** → **Providers**
4. You'll see a list of available providers

## Step 2: Configure Google OAuth

### In Google Developer Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure the consent screen if prompted
6. For **Application type**, select **Web application**
7. Add your authorized redirect URIs:
   - For development: `https://your-project-ref.supabase.co/auth/v1/callback`
   - For production: `https://yourdomain.com/auth/v1/callback`
8. Copy the **Client ID** and **Client Secret**

### In Supabase:

1. In your Supabase dashboard, find **Google** in the providers list
2. Toggle it **ON**
3. Paste your **Client ID** and **Client Secret**
4. Configure redirect URLs if needed
5. Click **Save**

## Step 3: Configure Facebook OAuth

### In Facebook Developer Console:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add **Facebook Login** product to your app
4. In **Facebook Login** settings, add these **Valid OAuth Redirect URIs**:
   - For development: `https://your-project-ref.supabase.co/auth/v1/callback`
   - For production: `https://yourdomain.com/auth/v1/callback`
5. Copy your **App ID** and **App Secret** from **Settings** → **Basic**

### In Supabase:

1. In your Supabase dashboard, find **Facebook** in the providers list
2. Toggle it **ON**
3. Paste your **App ID** as Client ID and **App Secret** as Client Secret
4. Configure redirect URLs if needed
5. Click **Save**

## Step 4: Update Your Site URL

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Update your **Site URL** to match your domain:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add any additional redirect URLs under **Redirect URLs**

## Step 5: Test OAuth Login

1. Deploy your changes or run your development server
2. Navigate to your login page
3. Click the Google or Facebook login buttons
4. You should be redirected to the respective OAuth provider
5. After authorization, you should be redirected back to your site

## Troubleshooting

### Common Issues:

1. **"Unsupported provider" error**: Make sure the provider is enabled in Supabase
2. **"Invalid redirect URI" error**: Check that your redirect URIs match exactly in both the provider console and Supabase
3. **"Client ID not found" error**: Verify your Client ID and Secret are correctly entered in Supabase

### Development vs Production:

- Use `localhost:3000` URLs for development
- Use your actual domain URLs for production
- Make sure to update both the OAuth provider settings and Supabase settings when switching environments

## Security Notes

- Keep your Client Secrets secure and never expose them in client-side code
- Use environment variables for sensitive configuration
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in the respective developer consoles

## Next Steps

After enabling OAuth, users will be able to:
- Sign up with Google or Facebook
- Sign in with existing OAuth accounts
- Link multiple OAuth providers to one account (if configured)

The OAuth integration will automatically create user accounts in your Supabase Auth system with the appropriate user metadata from the OAuth providers.
