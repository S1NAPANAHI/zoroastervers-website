# 🧪 OAuth Testing Checklist

Use this checklist to verify your OAuth implementation is working correctly.

## 📋 Pre-Testing Setup

### ✅ Environment Variables Check

Make sure your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### ✅ Supabase Configuration Check

1. **Database**: Go to Supabase Table Editor → verify `users` table exists
2. **Auth Providers**: Go to Authentication → Settings → Providers
   - ✅ Google: Enabled with Client ID and Secret
   - ✅ Facebook: Enabled with App ID and Secret
3. **Auth Settings**: Go to Authentication → Settings
   - ✅ Site URL: `https://zoroastervers.com`
   - ✅ Redirect URLs include: `https://zoroastervers.com/auth/callback`

---

## 🧪 Local Testing (Development)

### 1. Start Your Development Server
```bash
npm run dev
```

### 2. Test Demo Login (Baseline)
1. Go to `http://localhost:3000/login`
2. Click **"🚀 Demo Login (LoreMaster42)"**
3. ✅ Should redirect to profile page
4. ✅ Should show user info in profile

### 3. Test Google OAuth
1. Go to `http://localhost:3000/login`
2. Click **"Continue with Google"** button
3. ✅ Should redirect to Google login page
4. Complete Google authentication
5. ✅ Should redirect back to `http://localhost:3000/profile`
6. ✅ Profile should show your Google name and email
7. ✅ Check Supabase Table Editor → users table should have new record

### 4. Test Facebook OAuth
1. **Logout first**: Click logout in profile
2. Go to `http://localhost:3000/login`
3. Click **"Continue with Facebook"** button
4. ✅ Should redirect to Facebook login page
5. Complete Facebook authentication
6. ✅ Should redirect back to `http://localhost:3000/profile`
7. ✅ Profile should show your Facebook name and email
8. ✅ Check Supabase Table Editor → users table should have new record

---

## 🌐 Production Testing

### 1. Test Google OAuth (Production)
1. Go to `https://zoroastervers.com/login`
2. Click **"Continue with Google"**
3. ✅ Should redirect to Google
4. Complete authentication
5. ✅ Should redirect to `https://zoroastervers.com/profile`
6. ✅ User data should be correctly displayed

### 2. Test Facebook OAuth (Production)
1. **Logout first** from your profile
2. Go to `https://zoroastervers.com/login`
3. Click **"Continue with Facebook"**
4. ✅ Should redirect to Facebook
5. Complete authentication
6. ✅ Should redirect to `https://zoroastervers.com/profile`
7. ✅ User data should be correctly displayed

---

## 🔍 Database Verification

After each successful OAuth login, verify in Supabase:

### Check Users Table
1. Go to Supabase Dashboard → Table Editor → `users`
2. ✅ New user record should exist with:
   - `id`: UUID matching auth.users table
   - `username`: Name from OAuth provider
   - `email`: Email from OAuth provider
   - `avatar`: Profile picture URL (if available)
   - `join_date`: Today's date
   - `role`: 'user'
   - `is_admin`: false
   - `achievements`: Welcome achievement
   - `favorites`, `progress`, `preferences`: Default values

### Check Auth Users Table
1. Go to Authentication → Users
2. ✅ Should see user entry with OAuth provider info

---

## 🚨 Common Issues & Solutions

### Issue 1: "Unsupported provider" Error
**What it means**: OAuth provider not enabled in Supabase
**Solution**: 
- Go to Authentication → Settings → Providers
- Make sure Google/Facebook is toggled ON
- Verify Client ID and Secret are filled in

### Issue 2: "Invalid redirect URI" Error
**What it means**: Redirect URL mismatch
**Solution**:
- In Google Cloud Console: Check redirect URI is `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- In Facebook Developer Console: Check redirect URI matches exactly
- In Supabase: Verify redirect URLs are configured

### Issue 3: Redirect Loop or Blank Page
**What it means**: Callback route not working
**Solution**:
- Verify `src/app/auth/callback/route.ts` exists
- Check browser developer console for errors
- Ensure environment variables are set correctly

### Issue 4: User Profile Not Created
**What it means**: Database trigger not working
**Solution**:
- Check if `users` table exists
- Verify the `handle_new_user()` function and trigger are created
- Check Supabase logs for errors

---

## 📊 Success Indicators

When everything is working perfectly:

- ✅ OAuth buttons are clickable and styled correctly
- ✅ Clicking redirects to OAuth provider (Google/Facebook)
- ✅ After authentication, user is redirected back to your site
- ✅ User profile page shows correct information from OAuth provider
- ✅ User record is created in Supabase users table
- ✅ Authentication persists after browser refresh
- ✅ Logout works correctly
- ✅ Users can switch between OAuth providers

---

## 🎯 Next Steps After Successful Testing

1. **Set up admin user**: Manually update a user's role to 'admin' in Supabase
2. **Test admin features**: Verify admin panel access works
3. **Add more OAuth providers**: GitHub, Twitter, Discord, etc.
4. **Implement email confirmation**: For users who sign up with email/password
5. **Add profile editing**: Allow users to update their profiles
6. **Set up monitoring**: Track OAuth success/failure rates

---

## 📞 Getting Help

If you encounter issues:
1. Check browser developer console for JavaScript errors
2. Check Supabase logs in Dashboard → Logs
3. Verify all URLs and credentials are correct
4. Test with different browsers/incognito mode
5. Clear browser cache and cookies

Your OAuth system should now be fully functional! 🚀
