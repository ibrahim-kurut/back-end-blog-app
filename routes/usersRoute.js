const router = require("express").Router();
const { getAllUsersProfile, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl } = require("../controllers/usersController");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyTokenAndAdmin, verifyTokenAndOnlyUser } = require("../middlewares/verifyToken");



// /api/users/profile
router.route('/profile').get(verifyTokenAndAdmin, getAllUsersProfile)

// /api/users/profile/:id
router.route('/profile/:id')
    .get(validateObjectId, getUserProfileCtrl)
    .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfileCtrl)

// /api/users/count
router.route('/count').get(verifyTokenAndAdmin, getUsersCountCtrl)

module.exports = router