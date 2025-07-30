-- Policies for character_associations
-- Public read for associations of published characters
CREATE POLICY "Allow read character associations for published characters" ON character_associations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_associations.character_id 
    AND characters.status = 'published'
  )
);

-- Full CRUD for admin role
CREATE POLICY "Allow full access for admins on character_associations" ON character_associations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);