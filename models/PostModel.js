const mongoose = require('mongoose');
const Joi = require('joi');

// Create Post Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minLength: 5,
        maxLength: 100
    },
    description: {
        type: String,
        trim: true,
        required: true,
        minLength: 10
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    category: {
        type: String,
        required: true,
    },
    //! for multi images
    // images: [{
    //     url: {
    //         type: String,
    //         required: true
    //     },
    //     public_id: {
    //         type: String
    //     }
    // }],
    image: {
        type: Object,
        default: {
            url: "",
            publicId: null
        }
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true,
    // Create a relationship between the comment and the post that it is related to.
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
postSchema.virtual('comments', {
    ref: 'Comment', // from comment model
    foreignField: 'postId',
    localField: '_id',
})

// Create Post Model
const Post = mongoose.model("Post", postSchema);

// validate create post
function validateCreatePost(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(5).max(100).required(),
        description: Joi.string().trim().min(10).required(),
        category: Joi.string().trim().required()
    })
    return schema.validate(obj);
}
// validate update post
function validateUpdatePost(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(5).max(100),
        description: Joi.string().trim().min(10),
        category: Joi.string().trim()
    })
    return schema.validate(obj);
}
module.exports = {
    Post,
    validateCreatePost,
    validateUpdatePost
}