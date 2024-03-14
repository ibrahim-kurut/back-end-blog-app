const router = require("express").Router();
const { getAllUsersProfile, getUserProfileCtrl } = require("../controllers/usersController");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");



// /api/users/profile
router.route('/profile').get(verifyTokenAndAdmin, getAllUsersProfile)

// /api/users/profile/:id
router.route('/profile/:id').get(validateObjectId, getUserProfileCtrl)

module.exports = router