// controllers/reviewController.js
const reviewModel = require('../models/reviewModel');
const inventoryModel = require('../models/inventory-model');
const { validationResult } = require('express-validator');
const utilities = require('../utilities');

// Display review form
async function showReviewForm(req, res, next) {
    try {
        const inv_id = req.params.inv_id;
        const vehicle = await inventoryModel.getVehicleById(inv_id);
        
        if (!vehicle) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/');
        }

        // Check if user already reviewed this vehicle
        const hasReviewed = await reviewModel.hasUserReviewed(inv_id, req.session.user.account_id);
        
        if (hasReviewed) {
            req.flash('error', 'You have already reviewed this vehicle.');
            return res.redirect(`/inv/detail/${inv_id}`);
        }

        const nav = await utilities.getNavList();
        
        res.render('reviews/add-review', {
            title: `Review ${vehicle.inv_make} ${vehicle.inv_model}`,
            nav,
            vehicle,
            errors: [],
            review_rating: '',
            review_text: ''
        });
    } catch (error) {
        next(error);
    }
}

// Process review submission
async function addReview(req, res, next) {
    try {
        const errors = validationResult(req);
        const { inv_id, review_rating, review_text } = req.body;
        const account_id = req.session.user.account_id;

        if (!errors.isEmpty()) {
            const vehicle = await inventoryModel.getVehicleById(inv_id);
            const nav = await utilities.getNavList();
            
            return res.render('reviews/add-review', {
                title: `Review ${vehicle.inv_make} ${vehicle.inv_model}`,
                nav,
                vehicle,
                errors: errors.array(),
                review_rating,
                review_text
            });
        }

        // Check if user already reviewed
        const hasReviewed = await reviewModel.hasUserReviewed(inv_id, account_id);
        
        if (hasReviewed) {
            req.flash('error', 'You have already reviewed this vehicle.');
            return res.redirect(`/inv/detail/${inv_id}`);
        }

        const result = await reviewModel.addReview({
            inv_id,
            account_id,
            review_rating: parseInt(review_rating),
            review_text
        });

        if (result) {
            req.flash('success', 'Review added successfully!');
            return res.redirect(`/inv/detail/${inv_id}`);
        } else {
            throw new Error('Failed to add review.');
        }
    } catch (error) {
        next(error);
    }
}

// Show edit review form
async function showEditReviewForm(req, res, next) {
    try {
        const review_id = req.params.review_id;
        const review = await reviewModel.getReviewById(review_id);
        
        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect('/');
        }

        // Ensure user owns this review
        if (review.account_id !== req.session.user.account_id) {
            req.flash('error', 'Unauthorized access.');
            return res.redirect('/');
        }

        const vehicle = await inventoryModel.getVehicleById(review.inv_id);
        const nav = await utilities.getNavList();
        
        res.render('reviews/edit-review', {
            title: `Edit Review`,
            nav,
            vehicle,
            review,
            errors: []
        });
    } catch (error) {
        next(error);
    }
}

// Process review update
async function updateReview(req, res, next) {
    try {
        const errors = validationResult(req);
        const { review_id, review_rating, review_text } = req.body;
        
        const review = await reviewModel.getReviewById(review_id);
        
        if (!review || review.account_id !== req.session.user.account_id) {
            req.flash('error', 'Unauthorized access.');
            return res.redirect('/');
        }

        if (!errors.isEmpty()) {
            const vehicle = await inventoryModel.getVehicleById(review.inv_id);
            const nav = await utilities.getNavList();
            
            return res.render('reviews/edit-review', {
                title: `Edit Review`,
                nav,
                vehicle,
                review: { ...review, review_rating, review_text },
                errors: errors.array()
            });
        }

        const result = await reviewModel.updateReview({
            review_id,
            review_rating: parseInt(review_rating),
            review_text
        });

        if (result) {
            req.flash('success', 'Review updated successfully!');
            return res.redirect(`/inv/detail/${review.inv_id}`);
        } else {
            throw new Error('Failed to update review.');
        }
    } catch (error) {
        next(error);
    }
}

// Delete review
async function deleteReview(req, res, next) {
    try {
        const review_id = req.params.review_id;
        const review = await reviewModel.getReviewById(review_id);
        
        if (!review || review.account_id !== req.session.user.account_id) {
            req.flash('error', 'Unauthorized access.');
            return res.redirect('/');
        }

        const result = await reviewModel.deleteReview(review_id);

        if (result) {
            req.flash('success', 'Review deleted successfully!');
            return res.redirect(`/inv/detail/${review.inv_id}`);
        } else {
            throw new Error('Failed to delete review.');
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    showReviewForm,
    addReview,
    showEditReviewForm,
    updateReview,
    deleteReview
};
