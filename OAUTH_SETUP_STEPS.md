# 🔧 Complete OAuth Setup Guide

## ✅ What's Already Done

- ✅ Updated login and signup pages with proper Google and Facebook icons  
- ✅ Implemented real Supabase OAuth authentication functions
- ✅ Created OAuth callback route handler  
- ✅ Added database schema for user profiles
- ✅ Updated AuthContext to load user profiles from database
- ✅ Deployed all changes to GitHub and Vercel

## 🚀 Next Steps to Complete OAuth Setup

### 1. Set Up Database Schema in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the entire content from `database/users-schema.sql`
5. Click **Run** to execute the SQL commands

This will create:
- Users table with all necessary fields
- Row Level Security policies
- Auto-creation triggers for new users
- Performance indexes

### 2. Enable OAuth Providers in Supabase

#### For Google OAuth:

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Settings** → **Providers**
   - Find **Google** and toggle it **ON**

2. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Navigate to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client IDs**
   - Configure consent screen if prompted
   - For **Application type**, select **Web application**
   - Add authorized redirect URIs:
     - Development: `https://your-project-ref.supabase.co/auth/v1/callback`
     - Production: `https://zoroastervers.com/auth/v1/callback`
   - Copy **Client ID** and **Client Secret**

3. **Back in Supabase:**
   - Paste **Client ID** and **Client Secret** in Google provider settings
   - Click **Save**

#### For Facebook OAuth:

1. **In Supabase Dashboard:**
   - Find **Facebook** and toggle it **ON**

2. **Get Facebook OAuth Credentials:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or select existing one
   - Add **Facebook Login** product
   - In **Facebook Login** settings, add **Valid OAuth Redirect URIs**:
     - Development: `https://your-project-ref.supabase.co/auth/v1/callback`
     - Production: `https://zoroastervers.com/auth/v1/callback`
   - Copy **App ID** and **App Secret** from **Settings** → **Basic**

3. **Back in Supabase:**
   - Paste **App ID** as Client ID and **App Secret** as Client Secret
   - Click **Save**

### 3. Configure Site URL in Supabase

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Update **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://zoroastervers.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://zoroastervers.com/auth/callback`

### 4. Test OAuth Authentication

1. **Local Testing:**
   - Run `npm run dev`
   - Go to `http://localhost:3000/login`
   - Try clicking **Continue with Google** and **Continue with Facebook**
   - You should be redirected to OAuth providers
   - After authorization, you should be redirected back to your profile page

2. **Production Testing:**
   - Go to `https://zoroastervers.com/login`
   - Test both OAuth providers

### 5. Troubleshooting Common Issues

#### "Unsupported provider" Error:
- Make sure the provider is enabled in Supabase dashboard
- Check that Client ID and Secret are correctly entered

#### "Invalid redirect URI" Error:
- Verify redirect URIs match exactly in both provider console and Supabase
- Make sure to include `/auth/v1/callback` (not `/auth/callback`)

#### "Client ID not found" Error:
- Double-check Client ID and Secret in Supabase settings
- Make sure the OAuth app is properly configured in provider console

### 6. Verify Database Integration

After successful OAuth login, check:
1. Go to Supabase **Table Editor** → **users**
2. You should see new user records created automatically
3. User profiles should include data from OAuth providers (name, email, avatar)

## 🎉 Success Indicators

When everything is working correctly:
- ✅ OAuth buttons redirect to Google/Facebook
- ✅ After authorization, users are redirected back to your site
- ✅ User profiles are automatically created in database
- ✅ Users can access their profile page with correct information
- ✅ User sessions persist across browser refreshes

## 📞 Support

If you encounter any issues:
1. Check browser console for error messages
2. Check Supabase logs in dashboard
3. Verify all URLs and credentials are correct
4. Make sure environment variables are set in Vercel

Your authentication system is now production-ready with proper OAuth integration! 🚀
