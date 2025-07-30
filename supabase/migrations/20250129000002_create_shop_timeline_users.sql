-- Create shop_items table for hierarchical shop structure
CREATE TABLE shop_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('issue', 'arc', 'saga', 'volume', 'book')),
  parent_id UUID REFERENCES shop_items(id),
  order_index INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  content TEXT,
  description TEXT,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timeline_events table
CREATE TABLE timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('political', 'magical', 'technological', 'cultural', 'catastrophic')),
  description TEXT NOT NULL,
  details TEXT,
  book_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for authentication
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_shop_items_parent_id ON shop_items(parent_id);
CREATE INDEX idx_shop_items_type ON shop_items(type);
CREATE INDEX idx_shop_items_status ON shop_items(status);
CREATE INDEX idx_timeline_events_category ON timeline_events(category);
CREATE INDEX idx_timeline_events_date ON timeline_events(date);

-- Enable Row Level Security (RLS)
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for shop_items
-- Allow read access to published items for everyone
CREATE POLICY "Allow read published shop items" ON shop_items
  FOR SELECT USING (status = 'published');

-- Allow full access for admin users
CREATE POLICY "Allow full access for admins on shop_items" ON shop_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create policies for timeline_events
-- Allow read access for everyone
CREATE POLICY "Allow read timeline events" ON timeline_events
  FOR SELECT USING (true);

-- Allow full access for admin users
CREATE POLICY "Allow full access for admins on timeline_events" ON timeline_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create policies for users
-- Allow users to read their own data
CREATE POLICY "Allow users to read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow admins to manage all users
CREATE POLICY "Allow admins to manage users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Insert sample data for testing
INSERT INTO shop_items (title, type, parent_id, order_index, price, description, status) VALUES
('ZOROASTER Universe', 'book', NULL, 1, 0, 'Complete universe collection', 'published'),
('Book 1: The Awakening', 'volume', (SELECT id FROM shop_items WHERE title = 'ZOROASTER Universe'), 1, 25.99, 'First volume of the epic saga', 'published'),
('Book 2: The Convergence', 'volume', (SELECT id FROM shop_items WHERE title = 'ZOROASTER Universe'), 2, 25.99, 'Second volume continues the journey', 'published');

INSERT INTO timeline_events (title, date, category, description, details) VALUES
('The Great Awakening', '2157 AE', 'magical', 'The first recorded magical awakening in the modern era', 'This event marked the beginning of widespread magical abilities among the population.'),
('Formation of the First Alliance', '2160 AE', 'political', 'The major kingdoms unite against the growing magical threat', 'Seven kingdoms formed the First Alliance to regulate and control magical practitioners.'),
('The Convergence Event', '2165 AE', 'catastrophic', 'Reality itself begins to fracture', 'Multiple dimensions started bleeding into each other, causing widespread chaos.');
