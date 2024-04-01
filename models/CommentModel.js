const mongoose = require('mongoose')
const Joi = require('joi')

// Create Comment Schema

const CommentSchema = new mongoose.Schema({
    // Her yorumun kendisine bağlı bir postId'si vardır; bu yorumun ait olduğu gönderinin kimliğidir
    postId: {
        type: mongoose.Schema.Types.ObjectId,  // reference to the post model id
        ref: "Post",
        require: true
    },
    // kullanicinin id`isi ile eşleşen bir userId
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        require: true
    },
    // username comment`i yazan user
    username: {
        type: String,
        require: true
    }
}, { timestamps: true })

// Create Comment Model
const Comment = mongoose.model("Comment", CommentSchema)

// Validation Create Comments
function validateCreateComment(obj) {
    const schema = Joi.object({
        postId: Joi.string().required(),
        comment: Joi.string().required(),
    })
    return schema.validate(obj)
}
// Validation Update Comments
function validateUpdateComment(obj) {
    const schema = Joi.object({
        comment: Joi.string().required(),
    })
    return schema.validate(obj)
}

module.exports = {
    Comment,
    validateCreateComment,
    validateUpdateComment
}