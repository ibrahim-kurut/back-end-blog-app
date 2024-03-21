const asyncHandler = require('express-async-handler')
const path = require('path');
const fs = require('fs');
const { validateCreatePost, Post } = require('../models/PostModel');
const { cloudinaryUploadImage } = require('../utils/cloudinary');

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
        return res.status(400).json({ message: "sec No file uploaded" })
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
