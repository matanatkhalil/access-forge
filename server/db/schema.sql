-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
    id SERIAL PRIMARY KEY,
    user_id INT DEFAULT NULL,
    title VARCHAR(100) NOT NULL DEFAULT 'Default Board',
    is_default  BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT foreign_key_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Create tiles board
CREATE TABLE IF NOT EXISTS tiles (
    id SERIAL PRIMARY KEY,
    board_id INT NOT NULL,
    label VARCHAR(50) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    color VARCHAR(20) DEFAULT '#ffffff',
    position_index INT NOT NULL,
    CONSTRAINT foreign_key_board
        FOREIGN KEY (board_id)
        REFERENCES boards(id)
        ON DELETE CASCADE
);


INSERT INTO boards (title, is_default) VALUES ('Default Board', TRUE);

INSERT INTO tiles (board_id, label, icon_name, color, position_index) VALUES
(1, 'Eat', 'Utensils', '#f97316', 0),
(1, 'Drink', 'GlassWater', '#0284c7', 1),
(1, 'Help', 'Hand', '#eab308', 2),
(1, 'More', 'Plus', '#a855f7', 3),
(1, 'Want', 'Heart', '#ec4899', 4),
(1, 'Please', 'Smile', '#06b6d4', 5),
(1, 'Yes', 'Check', '#16a34a', 6),
(1, 'No', 'X', '#dc2626', 7),
(1, 'Stop', 'OctagonX', '#b91c1c', 8),
(1, 'Go', 'ArrowRight', '#2563eb', 9),
(1, 'Thanks', 'HeartHandshake', '#059669', 10),
(1, 'Like', 'ThumbsUp', '#d97706', 11);
