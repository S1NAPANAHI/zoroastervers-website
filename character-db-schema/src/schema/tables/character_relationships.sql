-- Character Relationships Table
CREATE TABLE character_relationships (
    id SERIAL PRIMARY KEY,
    character_id INT NOT NULL,
    related_character_id INT NOT NULL,
    relationship_type VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (related_character_id) REFERENCES characters(id) ON DELETE CASCADE
);