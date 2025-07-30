-- Table: character_associations

CREATE TABLE character_associations (
    id SERIAL PRIMARY KEY,
    character_id INT NOT NULL,
    association_name VARCHAR(255) NOT NULL,
    association_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);