const mongoose = require('mongoose')
const Joi = require('joi')

// Create Category Schema

const CategoryScehma = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

// Create Category Model

const Category = mongoose.model('Category', CategoryScehma)

// validation Create Category

function validateCreateCategory(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().required()
    })
    return schema.validate(obj);
}

module.exports = {
    Category,
    validateCreateCategory
}