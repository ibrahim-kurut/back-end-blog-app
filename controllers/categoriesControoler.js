const asyncHandler = require('express-async-handler')
const { validateCreateCategory, Category } = require('../models/CategoryModel')

//! Create New Category
/**
 * @desc Create a new Category
 * @route /api/categories
 * @method POST 
 * @access private (only admin)
 */

module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
    // 1- validation
    const { error } = validateCreateCategory(req.body)

    if (error) {
        return res.status(404).json({ message: error.details[0].message })
    }
    // 2- create category
    const category = await Category.create({
        title: req.body.title,
        user: req.user.id // from logged user
    })
    res.status(201).json(category)
})

//! Get All Category
/**
 * @desc Get All Category
 * @route /api/categories
 * @method GET 
 * @access public
 */
module.exports.getAllCategoryCtrl = asyncHandler(async (req, res) => {
    const categories = await Category.find()
    res.status(200).json(categories)
})