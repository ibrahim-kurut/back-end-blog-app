const asyncHandler = require('express-async-handler')
const { User, validateUpdateUser } = require('../models/UserModel')
const bcrypt = require('bcryptjs');


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

// =================== Update User Profile ===================
/**
 * @desc    Update User Profile
 * @route   /api/auth/profile/:id
 * @method  PUT
 * @access  private (only user himself)
 */

module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
    // validation
    const { error } = validateUpdateUser(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    // hash  password
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    // update user in DB
    const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                username: req.body.username,
                password: req.body.password,
                bio: req.body.bio
            }
        },
        { new: true }).select('-password')

    // sent response to client
    res.status(200).json(updateUser)
})

