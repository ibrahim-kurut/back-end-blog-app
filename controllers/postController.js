const asyncHandler = require('express-async-handler')
const path = require('path');
const fs = require('fs');
const { validateCreatePost, Post, validateUpdatePost } = require('../models/PostModel');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../utils/cloudinary');
const { Comment } = require('../models/CommentModel')
// Create New Post
/**
 * @desc Create New Post
 * @route /api/posts
 * @method POST
 * @access private (only logged in users)
 */

module.exports.createPostCtrl = asyncHandler(async (req, res) => {

    // 1- validation for images
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No file uploaded" })
    }

    // 2- validation for data
    const { error } = validateCreatePost(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    // 3- upload photo
    const images = [];
    for (const file of req.files) {
        //__a find image path
        const imagePath = path.join(__dirname, `../images/${file.filename}`);
        //__b upload image to cloudinary
        const result = await cloudinaryUploadImage(imagePath);
        images.push({
            public_id: result.public_id,
            url: result.secure_url
        });
        // Remove images from the server
        fs.unlinkSync(imagePath);
    }

    // 4- create new post and save it to DB
    const newPost = await Post.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        user: req.user.id,
        images: images
    })

    // 5- send response to client
    res.status(201).json({
        message: "Successfully created",
        newPost
    })

})

// ========== Get All Post
/**
 * @desc Get All Post
 * @route /api/posts
 * @method GET
 * @access public
 */
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
    // create pagination
    const POST_PER_PAGE = 3; // 3 posts per page
    const { pageNumber, category } = req.query;
    let posts;

    // ===== get post by Page Number =====
    if (pageNumber) {
        posts = await Post.find()
            .skip((pageNumber - 1) * POST_PER_PAGE)
            .limit(POST_PER_PAGE)
            .sort({ createdAt: -1 })
            .populate("user", ['-password'])
        // ===== get post by category =====
    } else if (category) {
        posts = await Post.find({ category })
            .sort({ createdAt: -1 })
            .populate("user", ['-password'])
            ;
    } else {
        posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("user", ['-password'])
    }
    res.status(200).json(posts);
})
// ======= Get Single Post
/**
 * @desc Get Single Post
 * @route /api/post/:id
 * @method GET
 * @access public
 */

module.exports.getSinglePostCtrl = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate("user", ['-password']).populate("comments")
    if (!post) {
        return res.status(404).json({ message: "post not found" })
    }
    res.status(200).json(post);
})


// ======= Get Count of Posts
/**
 * @desc Get Count of Posts
 * @route /api/post/count
 * @method GET
 * @access public
 */

module.exports.getCountPostsCtrl = asyncHandler(async (req, res) => {
    const count = await Post.countDocuments()

    res.status(200).json(count);
})

// ======= Delete Post
/**
 * @desc Delete Post
 * @route /api/post/:id
 * @method DELETE
 * @access private (only admin or owner of the post)
 */

module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
    // 1- get post to be deleted and check the post exist or not
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({ message: "post not found" })
    }

    // 2- If it is admin or the user who shared the post, allow it to be deleted.
    if (req.user.isAdmin || req.user.id === post.user.toString()) {
        await Post.findByIdAndDelete(req.params.id)
        await cloudinaryRemoveImage(post.images.publicId)


        // delete all comments that belong to this post
        await Comment.deleteMany({ postId: post._id })
        res.status(200).json({
            message: 'post deleted successfully',
            postId: post._id
        });
    } else {
        res.status(403).json({ message: 'you are unauthorized' })
    }

})


// ======= Update Post
/**---------------------------------------------------
 * @desc Update Post
 * @route /api/post/:id
 * @method PUT
 * @access private (only owner of the post)
 ---------------------------------------------------*/

module.exports.upddatePostCtrl = asyncHandler(async (req, res) => {
    // 1- validation
    const { error } = validateUpdatePost(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    // 2- get the from DB and check if post exist or not
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({ message: 'post not found' })
    }
    // 3- check if this post belong to logged in user
    if (req.user.id !== post.user.toString()) {
        return res.status(403).json({ message: 'you are unauthorized' })
    }
    // 4- update post
    const updatePost = await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category
        }
    },
        { new: true })
        .populate("user", ["-password"])
    // 5- send response to client
    res.status(200).json({
        message: 'update successfully',
        updatePost

    })
})

// ======= Toggle Like
/**---------------------------------------------------
 * @desc Toggle Like
 * @route /api/posts/like/:id
 * @method PUT
 * @access private (only logged in user)
 ---------------------------------------------------*/
module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {

    const loggedInUser = req.user.id; // The user who is logged in
    const { id: postId } = req.params; // The id of the post that we want to like

    // 1. get the post from DB
    let post = await Post.findById(postId)
    // 2. check if the post exist in DB or no
    if (!post) {
        return res.status(404).json({ message: "this post not found" })
    }


    // 3. check if logged in user (user.id) exsit in like array or no
    const isPostAlreadyLiked = post.likes.find((user) => user.toString() === loggedInUser)

    // check if this user a like or not? If likes, we will remove the like
    if (isPostAlreadyLiked) {
        post = await Post.findByIdAndUpdate(postId, {
            // pull ==> from mongoose It can remove the value from the array
            // remove userId from the likes array
            $pull: { likes: loggedInUser }
        },
            { new: true })
    } else {
        // push into the array
        post = await Post.findByIdAndUpdate(postId, {
            $push: { likes: loggedInUser }
        },
            { new: true })
    }
    // 5. send response to client
    res.status(200).json(post)
})