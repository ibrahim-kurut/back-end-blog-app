const asyncHandler = require('express-async-handler')
const { User } = require('../models/UserModel')

// =================== Get all Users Profile ===================
/**
 * @desc    Get all Users Profile
 * @route   /api/auth/profile
 * @method  GET
 * @access  private (only admin)
 */

module.exports.getAllUsersProfile = asyncHandler(async (req, res) => {
    //console.log(req.headers.authorization);
    const users = await User.find()
    res.status(200).json(users)
})