// Profile Controller
const Profile = require("../models/profileModel");

async function viewProfile(req, res) {
    const accountId = req.session.account_id;
    const profile = await Profile.getProfile(accountId);
    res.render("profile/view", { profile });
}

async function editProfile(req, res) {
    const accountId = req.session.account_id;
    const { bio, profile_picture, social_links } = req.body;
    await Profile.updateProfile(accountId, bio, profile_picture, social_links);
    res.redirect("/profile");
}

module.exports = { viewProfile, editProfile };