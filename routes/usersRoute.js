const router = require("express").Router();
const { getAllUsersProfile, getUserProfileCtrl, updateUserProfileCtrl, getUsersCountCtrl, profilePhotoUploadCtrl, deleteUserProfileCtrl } = require("../controllers/usersController");
const photoUpload = require("../middlewares/photoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyToken, verifyTokenAndAuthorization, } = require("../middlewares/verifyToken");



// /api/users/profile
router.route('/profile').get(verifyTokenAndAdmin, getAllUsersProfile)

// /api/users/profile/:id
router.route('/profile/:id')
    .get(validateObjectId, getUserProfileCtrl)
    .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfileCtrl)
    .delete(validateObjectId, verifyTokenAndAuthorization, deleteUserProfileCtrl)

// /api/users/profile/profile-photo-Upload
router.route('/profile/profile-photo-Upload')
    .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl)

// /api/users/count
router.route('/count').get(verifyTokenAndAdmin, getUsersCountCtrl)

module.exports = router