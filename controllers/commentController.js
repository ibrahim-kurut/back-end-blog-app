const asyncHandler = require('express-async-handler')
const { Comment, validateCreateComment } = require('../models/CommentModel')
const { User } = require('../models/UserModel')


//! Create New Comment
/**
 * @desc Create a new Comment
 * @route /api/comments
 * @method POST 
 * @access private (only logged in user)
 */

module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
    // 1- validation
    const { error } = validateCreateComment(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    // 2- get user profile because username is required from the user's id
    const userProfile = await User.findById(req.user.id)

    // 3- create new comment
    const newComment = await Comment.create({
        postId: req.body.postId,
        comment: req.body.comment,
        user: req.user.id, // from logged in user
        username: userProfile.username // from user model
    })
    // 4- send response to client
    res.status(201).json(newComment)
})

//! Get All Comment
/**
 * @desc Get All Comment
 * @route /api/comments
 * @method GET 
 * @access private (only admin)
 */
module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
    const comments = await Comment.find().populate("user")
    res.status(200).json(comments)
})
