// models/reviewModel.js
const db = require("../database");

// Get all reviews for a specific vehicle
async function getReviewsByVehicleId(inv_id) {
    const sql = `
        SELECT 
            r.review_id,
            r.review_rating,
            r.review_text,
            r.review_date,
            r.account_id,
            a.account_firstname,
            a.account_lastname
        FROM reviews r
        JOIN accounts a ON r.account_id = a.account_id
        WHERE r.inv_id = $1
        ORDER BY r.review_date DESC
    `;
    const result = await db.query(sql, [inv_id]);
    return result.rows;
}

// Get average rating for a vehicle
async function getAverageRating(inv_id) {
    const sql = `
        SELECT 
            COALESCE(AVG(review_rating), 0) as avg_rating,
            COUNT(*) as review_count
        FROM reviews
        WHERE inv_id = $1
    `;
    const result = await db.query(sql, [inv_id]);
    return result.rows[0];
}

// Add a new review
async function addReview({ inv_id, account_id, review_rating, review_text }) {
    const sql = `
        INSERT INTO reviews (inv_id, account_id, review_rating, review_text)
        VALUES ($1, $2, $3, $4)
        RETURNING review_id
    `;
    const result = await db.query(sql, [inv_id, account_id, review_rating, review_text]);
    return result.rows[0];
}

// Check if user already reviewed this vehicle
async function hasUserReviewed(inv_id, account_id) {
    const sql = `
        SELECT review_id
        FROM reviews
        WHERE inv_id = $1 AND account_id = $2
    `;
    const result = await db.query(sql, [inv_id, account_id]);
    return result.rows.length > 0;
}

// Get a specific review by ID
async function getReviewById(review_id) {
    const sql = `
        SELECT *
        FROM reviews
        WHERE review_id = $1
    `;
    const result = await db.query(sql, [review_id]);
    return result.rows[0];
}

// Update a review
async function updateReview({ review_id, review_rating, review_text }) {
    const sql = `
        UPDATE reviews
        SET review_rating = $1, review_text = $2
        WHERE review_id = $3
        RETURNING review_id
    `;
    const result = await db.query(sql, [review_rating, review_text, review_id]);
    return result.rowCount > 0;
}

// Delete a review
async function deleteReview(review_id) {
    const sql = `
        DELETE FROM reviews
        WHERE review_id = $1
        RETURNING review_id
    `;
    const result = await db.query(sql, [review_id]);
    return result.rowCount > 0;
}

module.exports = {
    getReviewsByVehicleId,
    getAverageRating,
    addReview,
    hasUserReviewed,
    getReviewById,
    updateReview,
    deleteReview
};
