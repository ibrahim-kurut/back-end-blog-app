const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Create schema User
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 100,
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            publicId: null
        }
    },
    bio: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

})
// give the posts that belong to this user when get the profile
UserSchema.virtual('posts', {
    ref: 'Post',
    foreignField: 'user',
    localField: '_id'
})

// Generate auth token
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '2h'
    })
}








// create user model
const User = mongoose.model('User', UserSchema)

// Register User Validation
function validateRegisterUser(obj) {
    const schema = Joi.object({
        username: Joi.string().trim().min(3).max(100).required(),
        email: Joi.string().trim().min(5).max(100).email().required(),
        password: Joi.string().trim().min(8).max(100).required()
    })
    return schema.validate(obj);
}

// Login User Validation
function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).email().required(),
        password: Joi.string().trim().min(8).max(100).required()
    })
    return schema.validate(obj);
}
// Update User Validation
function validateUpdateUser(obj) {
    const schema = Joi.object({
        username: Joi.string().trim().min(3).max(100),
        password: Joi.string().min(6).max(100),
        bio: Joi.string().trim().min(8)
    })
    return schema.validate(obj);
}


module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
}