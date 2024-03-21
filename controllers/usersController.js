const asyncHandler = require('express-async-handler')
const { User, validateUpdateUser } = require('../models/UserModel')
const bcrypt = require('bcryptjs');
const path = require('path');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../utils/cloudinary');
const fs = require('fs');

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

// =================== Get Users Count ===================
/**
 * @desc    Get Users Count
 * @route   /api/auth/count
 * @method  GET
 * @access  private (only admin)
 */

module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
    const count = await User.countDocuments()
    res.status(200).json(count)
})

// =================== Profile Photo Upload  ===================
/**
 * @desc    Profile Photo Upload 
 * @route   /api/users/profile/profile-photo-Upload 
 * @method  POST
 * @access  private (only logged in user)
 */

module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {

    // 1- validation
    // console.log(req.file);
    if (!req.file) {
        return res.status(404).json({ message: "No file provided" })
    }

    // 2- get the path to the photo
    const imgPath = path.join(__dirname, `../images/${req.file.filename}`)

    // 3- upload to cloudinary
    const result = await cloudinaryUploadImage(imgPath)
    // console.log(result);

    // 4- get the user from DB
    const user = await User.findById(req.user.id)
    // 5- delete the old profile photo if exist
    if (user.profilePhoto.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }
    // 6- change the profile photo field in the DB
    user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id,
    }
    await user.save()

    // 7- sent response to client
    res.status(200).json({
        message: "Profile Photo Upload Successfully!",
        profilePhoto: {
            url: result.secure_url,
            publicId: result.public_id,
        }

    });

    // 8- remove photo from the server
    fs.unlinkSync(imgPath)


})

// =================== Delete User Profile (Account)  ===================
/**
 * @desc    Delete User Profile (Account) 
 * @route   /api/users/profile/:id
 * @method  DELETE
 * @access  private (only admin or user himself)
 */

module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
    // 1- get user from DB
    // 1. Get the user from DB
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    /** 
     * @NOTE
     * @TODOs We'll complete this after creating the post image and comments
     */

    // @TODO 2- get all posts from DB
    // @TODO 3- get the public ids from the posts
    // @TODO 4- delete all posts  image  from Cloudinary that belong  to this user



    // 5- delete the profile  image from Cloudinary
    await cloudinaryRemoveImage(user.profilePhoto.publicId)

    // @TODO 6- delete the user posts and comments

    // 7- delete the user himself
    await User.findByIdAndDelete(req.params.id)

    // 8- send response to client
    res.status(200).json({ message: "profile has ben deleted" })
})

