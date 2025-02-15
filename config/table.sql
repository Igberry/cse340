CREATE TABLE IF NOT EXISTS profiles (
    profile_id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    bio TEXT,
    profile_picture VARCHAR(255),
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT now()
);
