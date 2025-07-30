-- Users table to store additional user profile information
-- This extends the built-in auth.users table from Supabase

CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin users can view all profiles (commented out until we confirm table structure)
-- CREATE POLICY "Admin users can view all profiles" ON users
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM users 
--       WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
--     )
--   );

-- Create function to automatically create user profile (commented out until table structure is confirmed)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS trigger AS $$
-- BEGIN
--   INSERT INTO public.users (id, username, email, avatar, bio)
--   VALUES (
--     new.id,
--     COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
--     new.email,
--     COALESCE(new.raw_user_meta_data->>'avatar_url', '👤'),
--     COALESCE(new.raw_user_meta_data->>'bio', '')
--   );
--   RETURN new;
-- END;
-- $$ language plpgsql security definer;
-- 
-- -- Trigger to automatically create user profile when a new user signs up
-- CREATE OR REPLACE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

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

-- Create indexes for better performance (commented out until we confirm table structure)
-- CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
-- CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
-- CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
