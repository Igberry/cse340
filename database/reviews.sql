-- Create Reviews Table
DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    inv_id INT NOT NULL REFERENCES inventory(inv_id) ON DELETE CASCADE,
    account_id INT NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    review_rating INT NOT NULL CHECK (
        review_rating >= 1
        AND review_rating <= 5
    ),
    review_text TEXT NOT NULL,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(inv_id, account_id) -- One review per user per vehicle
);
-- Create index for faster queries
CREATE INDEX idx_reviews_inv_id ON reviews(inv_id);
CREATE INDEX idx_reviews_account_id ON reviews(account_id);
-- Sample data (optional)
-- INSERT INTO reviews (inv_id, account_id, review_rating, review_text)
-- VALUES (1, 1, 5, 'Amazing vehicle! Very reliable and comfortable.');