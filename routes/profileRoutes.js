const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, profileController.viewProfile);
router.post("/profile/edit", authMiddleware, profileController.editProfile);

module.exports = router;