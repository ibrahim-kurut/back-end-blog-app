const router = require("express").Router();
const { getAllUsersProfile } = require("../controllers/usersController");


// /api/users/profile

router.route('/profile').get(getAllUsersProfile)


module.exports = router