const asyncHandler = require('express-async-handler')
const { Comment, validateCreateComment, validateUpdateComment } = require('../models/CommentModel')
const { User } = require('../models/UserModel')
const { Post } = require('../models/PostModel')


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

    // Get the post that is being commented on
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({ message: "No post found with this ID ....." })
    }


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

//! Delete Comment
/**
 * @desc Delete Comment
 * @route /api/comment/:id
 * @method DELETE 
 * @access private (only admin or  creator of the comment can delete it)
 */
module.exports.deleteCommentsCtrl = asyncHandler(async (req, res) => {
    // 1- get the comment from DB
    const comment = await Comment.findById(req.params.id)
    // 2- check if comment exist or no
    if (!comment) {
        res.status(404).json({ message: "Comment not found" })
    }
    // 3- check the user is an admin  or the creator of this comment
    if (req.user.isAdmin || req.user.id === comment.user.toString()) {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted Successfully" })
    } else {
        res.status(403).json({ message: "you don't have permission to do that!" })
    }
})

//! Update Comment
/**
 * @desc Update Comment
 * @route /api/comment/:id
 * @method PUT 
 * @access private (Only the creator of the comment can edit it)
 */

module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
    // 1- validate
    const { error } = validateUpdateComment(req.body)
    if (error) {
        res.status(400).json({ message: error.details[0].message })
    }
    // 2- get the comment from DB
    const comment = await Comment.findById(req.params.id)
    // 3- check if the coment exist or no
    if (!comment) {
        res.status(404).json({ message: "The comment does not exists." })
    }
    // 4- check the user is the owner of the commnet or no
    if (req.user.id !== comment.user.toString()) {
        res.status(403).json({ message: "You can not edit this comment" })
    }
    // 5- update comment
    const updateComment = await Comment.findByIdAndUpdate(req.params.id, {
        $set: {
            comment: req.body.comment
        }
    }, { new: true })
    // 6- send response to client
    res.status(200).json(updateComment)
})