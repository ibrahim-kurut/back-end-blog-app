const router = require("express").Router();
const { getAllUsersProfile } = require("../controllers/usersController");
const { verifyToken } = require("../middlewares/verifyToken");


// /api/users/profile

router.route('/profile').get(verifyToken, getAllUsersProfile)


module.exports = router