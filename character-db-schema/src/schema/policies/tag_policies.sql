-- Policies for character_tags
-- Public read for all tags (tags are generally public)
CREATE POLICY "Allow read character tags" ON character_tags
FOR SELECT USING (true);

-- Full CRUD for admin role
CREATE POLICY "Allow full access for admins on character_tags" ON character_tags
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);