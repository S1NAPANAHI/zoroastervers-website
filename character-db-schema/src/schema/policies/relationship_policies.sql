-- Policies for character_relationships
-- Public read for relationships of published characters
CREATE POLICY "Allow read character relationships for published characters" ON character_relationships
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_relationships.character_id 
    AND characters.status = 'published'
  ) OR EXISTS (
    SELECT 1 FROM characters 
    WHERE characters.id = character_relationships.related_character_id 
    AND characters.status = 'published'
  )
);

-- Full CRUD for admin role
CREATE POLICY "Allow full access for admins on character_relationships" ON character_relationships
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);