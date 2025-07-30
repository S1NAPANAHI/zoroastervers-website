# 🚀 OAuth Implementation Guide - Step by Step

Follow these exact steps to implement OAuth authentication for your website.

## 📋 Prerequisites

- Access to your Supabase project dashboard
- Gmail account for Google OAuth setup
- Facebook account for Facebook OAuth setup

---

## 🗄️ Step 1: Set Up Database Schema

### 1.1 Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### 1.2 Execute the Database Schema

Copy and paste this entire SQL script:

```sql
-- Users table to store additional user profile information
-- This extends the built-in auth.users table from Supabase

CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  avatar TEXT DEFAULT '👤',
  bio TEXT DEFAULT '',
  join_date DATE DEFAULT CURRENT_DATE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_admin BOOLEAN DEFAULT FALSE,
  badges TEXT[] DEFAULT '{}',
  
  -- JSON fields for complex data
  achievements JSONB DEFAULT '[]',
  favorites JSONB DEFAULT '{"characters": [], "locations": [], "timelineEvents": [], "books": []}',
  progress JSONB DEFAULT '{"booksRead": 0, "totalBooks": 5, "timelineExplored": 0, "charactersDiscovered": 0, "locationsExplored": 0}',
  preferences JSONB DEFAULT '{"theme": "dark", "spoilerLevel": "none", "notifications": true}',
  custom_paths JSONB DEFAULT '[]',
  notes JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin users can view all profiles
CREATE POLICY "Admin users can view all profiles" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, email, avatar, bio)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', '👤'),
    COALESCE(new.raw_user_meta_data->>'bio', '')
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger to automatically create user profile when a new user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
```

### 1.3 Run the Script

1. Click **"Run"** button (or press Ctrl+Enter)
2. You should see success messages for each statement
3. Verify by going to **"Table Editor"** → you should see a new **"users"** table

---

## 🔑 Step 2: Get Your Supabase Project Details

### 2.1 Find Your Supabase Project Reference

1. In your Supabase dashboard, look at the URL
2. It should look like: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`
3. Copy the `YOUR_PROJECT_REF` part (it's a random string like `abcdefghijklmnop`)
4. Your callback URLs will be:
   - **Development**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - **Production**: `https://zoroastervers.com/auth/v1/callback`

---

## 🔵 Step 3: Set Up Google OAuth

### 3.1 Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Create a New Project** (or select existing one):
   - Click the project dropdown at the top
   - Click **"New Project"**
   - Name: `Zoroaster Website`
   - Click **"Create"**

3. **Enable Google+ API**:
   - Go to **"APIs & Services"** → **"Library"**
   - Search for **"Google+ API"**
   - Click on it and click **"Enable"**

4. **Configure OAuth Consent Screen**:
   - Go to **"APIs & Services"** → **"OAuth consent screen"**
   - Choose **"External"** user type
   - Fill in required fields:
     - **App name**: `ZOROASTER Universe`
     - **User support email**: Your email
     - **Developer contact email**: Your email
   - Click **"Save and Continue"** through all steps

5. **Create OAuth Credentials**:
   - Go to **"APIs & Services"** → **"Credentials"**
   - Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
   - **Application type**: Web application
   - **Name**: `Zoroaster Website OAuth`
   - **Authorized redirect URIs**: Add both:
     - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     - `https://zoroastervers.com/auth/v1/callback`
   - Click **"Create"**

6. **Copy Credentials**:
   - Copy the **Client ID** (starts with something like `123456789-abc...googleusercontent.com`)
   - Copy the **Client Secret** (random string)

### 3.2 Configure Google OAuth in Supabase

1. In Supabase dashboard, go to **"Authentication"** → **"Settings"** → **"Providers"**
2. Find **"Google"** and click to expand
3. **Enable Google provider** (toggle to ON)
4. Paste your **Client ID** and **Client Secret**
5. Click **"Save"**

---

## 🔵 Step 4: Set Up Facebook OAuth

### 4.1 Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Consumer"** app type
4. Fill in details:
   - **App name**: `ZOROASTER Universe`
   - **App contact email**: Your email
5. Click **"Create App"**

### 4.2 Configure Facebook Login

1. In your app dashboard, click **"Add Product"**
2. Find **"Facebook Login"** and click **"Set Up"**
3. Choose **"Web"** platform
4. **Site URL**: `https://zoroastervers.com`
5. Go to **"Facebook Login"** → **"Settings"**
6. **Valid OAuth Redirect URIs**: Add both:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - `https://zoroastervers.com/auth/v1/callback`
7. **Save Changes**

### 4.3 Get Facebook Credentials

1. Go to **"Settings"** → **"Basic"**
2. Copy the **App ID** (numeric value)
3. Copy the **App Secret** (click "Show" to reveal it)

### 4.4 Configure Facebook OAuth in Supabase

1. In Supabase dashboard, go to **"Authentication"** → **"Settings"** → **"Providers"**
2. Find **"Facebook"** and click to expand
3. **Enable Facebook provider** (toggle to ON)
4. **Client ID**: Paste your Facebook **App ID**
5. **Client Secret**: Paste your Facebook **App Secret**
6. Click **"Save"**

---

## ⚙️ Step 5: Configure Supabase Settings

### 5.1 Set Site URL and Redirect URLs

1. In Supabase dashboard, go to **"Authentication"** → **"Settings"**
2. **Site URL**: Set to `https://zoroastervers.com`
3. **Redirect URLs**: Add these (one per line):
   ```
   https://zoroastervers.com/auth/callback
   http://localhost:3000/auth/callback
   ```
4. Click **"Save"**

---

## 🧪 Step 6: Test Your OAuth Setup

### 6.1 Test Locally

1. Make sure your environment variables are set in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Run your development server:
   ```bash
   npm run dev
   ```

3. Go to `http://localhost:3000/login`
4. Click **"Continue with Google"** - you should be redirected to Google
5. Complete the OAuth flow - you should be redirected back to your profile
6. Repeat with **"Continue with Facebook"**

### 6.2 Test in Production

1. Go to `https://zoroastervers.com/login`
2. Test both Google and Facebook OAuth buttons
3. Verify users are redirected back to your site after authentication

### 6.3 Verify Database Integration

1. After successful OAuth login, go to Supabase **"Table Editor"** → **"users"**
2. You should see new user records with:
   - Correct user ID from auth.users
   - Username from OAuth provider
   - Email from OAuth provider
   - Avatar URL from OAuth provider (if available)

---

## 🔍 Step 7: Troubleshooting Common Issues

### Issue 1: "Unsupported provider" Error
**Solution**: Make sure the provider is enabled in Supabase dashboard and credentials are correct.

### Issue 2: "Invalid redirect URI" Error
**Solution**: 
- Check that redirect URIs match exactly in both provider console and Supabase
- Make sure to use `/auth/v1/callback` (not `/auth/callback`)
- Ensure your Supabase project reference is correct

### Issue 3: "Client ID not found" Error
**Solution**: Double-check Client ID and Secret are correctly entered in Supabase settings.

### Issue 4: Database Connection Issues
**Solution**: 
- Verify the users table was created successfully
- Check that Row Level Security policies are in place
- Ensure the trigger function is working

---

## ✅ Success Checklist

When everything is working correctly, you should have:

- ✅ Users table created in Supabase
- ✅ Google OAuth enabled and configured
- ✅ Facebook OAuth enabled and configured
- ✅ Site URL and redirect URLs configured
- ✅ OAuth buttons redirect to providers
- ✅ Users are redirected back after authentication
- ✅ User profiles are automatically created in database
- ✅ Authentication persists across browser sessions

---

## 🎉 You're Done!

Your OAuth authentication system is now fully functional! Users can sign in with Google or Facebook, and their profiles will be automatically created and managed in your Supabase database.

Next steps you might consider:
- Set up email confirmation for regular signups
- Add more OAuth providers (GitHub, Twitter, etc.)
- Implement user role management
- Add profile editing functionality
