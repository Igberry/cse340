// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { isAuthenticated } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation rules for reviews
const reviewValidation = [
    body('review_rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('review_text')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Review must be between 10 and 500 characters')
];

// Show add review form (must be logged in)
router.get('/add/:inv_id', isAuthenticated, reviewController.showReviewForm);

// Submit review (must be logged in)
router.post('/add', isAuthenticated, reviewValidation, reviewController.addReview);

// Show edit review form (must be logged in)
router.get('/edit/:review_id', isAuthenticated, reviewController.showEditReviewForm);

// Update review (must be logged in)
router.post('/edit', isAuthenticated, reviewValidation, reviewController.updateReview);

// Delete review (must be logged in)
router.post('/delete/:review_id', isAuthenticated, reviewController.deleteReview);

module.exports = router;
