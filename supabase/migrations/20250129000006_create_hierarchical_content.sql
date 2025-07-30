-- Drop existing constraints and tables if they exist
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS arcs CASCADE;
DROP TABLE IF EXISTS sagas CASCADE;
DROP TABLE IF EXISTS volumes CASCADE;
DROP TABLE IF EXISTS books CASCADE;

-- Create books table (top level)
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL DEFAULT 'S1NAPANAHI',
  price DECIMAL(10,2) DEFAULT 0,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  total_word_count INTEGER DEFAULT 0,
  is_complete BOOLEAN DEFAULT FALSE,
  physical_available BOOLEAN DEFAULT FALSE,
  digital_bundle BOOLEAN DEFAULT FALSE,
  publication_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create volumes table (linked to books)
CREATE TABLE volumes (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  physical_available BOOLEAN DEFAULT FALSE,
  digital_bundle BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, order_index)
);

-- Create sagas table (linked to volumes)
CREATE TABLE sagas (
  id SERIAL PRIMARY KEY,
  volume_id INTEGER NOT NULL REFERENCES volumes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(volume_id, order_index)
);

-- Create arcs table (linked to sagas)
CREATE TABLE arcs (
  id SERIAL PRIMARY KEY,
  saga_id INTEGER NOT NULL REFERENCES sagas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(saga_id, order_index)
);

-- Create issues table (linked to arcs)
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  arc_id INTEGER NOT NULL REFERENCES arcs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'pre-order', 'coming-soon')),
  release_date DATE,
  content_url TEXT,
  cover_image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(arc_id, order_index)
);

-- Create indexes for better performance
CREATE INDEX idx_volumes_book_id ON volumes(book_id);
CREATE INDEX idx_volumes_status ON volumes(status);
CREATE INDEX idx_sagas_volume_id ON sagas(volume_id);
CREATE INDEX idx_sagas_status ON sagas(status);
CREATE INDEX idx_arcs_saga_id ON arcs(saga_id);
CREATE INDEX idx_arcs_status ON arcs(status);
CREATE INDEX idx_issues_arc_id ON issues(arc_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_release_date ON issues(release_date);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE volumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE arcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Create policies for books
CREATE POLICY "Allow read published books" ON books
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow full access for admins on books" ON books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create policies for volumes
CREATE POLICY "Allow read published volumes" ON volumes
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow full access for admins on volumes" ON volumes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create policies for sagas
CREATE POLICY "Allow read published sagas" ON sagas
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow full access for admins on sagas" ON sagas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create policies for arcs
CREATE POLICY "Allow read published arcs" ON arcs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow full access for admins on arcs" ON arcs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create policies for issues
CREATE POLICY "Allow read published issues" ON issues
  FOR SELECT USING (status IN ('published', 'pre-order'));

CREATE POLICY "Allow full access for admins on issues" ON issues
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Insert sample data
INSERT INTO books (title, description, author, status, is_complete) VALUES
('ZOROASTER Universe', 'The complete ZOROASTER universe collection featuring epic fantasy adventures', 'S1NAPANAHI', 'published', false);

INSERT INTO volumes (book_id, title, description, order_index, status) VALUES
((SELECT id FROM books WHERE title = 'ZOROASTER Universe'), 'Volume I: The Awakening', 'The first volume of the ZOROASTER saga where ancient powers begin to stir', 1, 'published'),
((SELECT id FROM books WHERE title = 'ZOROASTER Universe'), 'Volume II: The Convergence', 'Reality bends as multiple worlds collide in this thrilling continuation', 2, 'draft');
