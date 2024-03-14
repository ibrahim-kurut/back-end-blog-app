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
    const users = await User.find().select("-password")
    res.status(200).json(users)
})

// =================== Get User Profile ===================
/**
 * @desc    Get User Profile
 * @route   /api/auth/profile/:id
 * @method  GET
 * @access  public
 */
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password")
    // chech if user not found
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user)


})