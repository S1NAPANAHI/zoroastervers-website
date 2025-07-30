-- Policies for Characters Table
-- Public read for published characters
CREATE POLICY "Allow read published characters" ON characters
FOR SELECT USING (status = 'published');

-- Full CRUD for admin role
CREATE POLICY "Allow full access for admins on characters" ON characters
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);