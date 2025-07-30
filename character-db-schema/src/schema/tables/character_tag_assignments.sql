-- Character Tag Assignments Table
CREATE TABLE character_tag_assignments (
    character_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (character_id, tag_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES character_tags(id) ON DELETE CASCADE
);