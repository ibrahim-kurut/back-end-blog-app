const asyncHandler = require('express-async-handler')
const { validateCreateCategory, Category, validateUpdateCategory } = require('../models/CategoryModel')

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
//! Delete Category
/**
 * @desc Delete Category
 * @route /api/categories/:id
 * @method DELETE 
 * @access private (only admin)
 */

module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
    // 1- get category by id
    const category = await Category.findById(req.params.id)

    // 2- check if the category exist or not
    if (!category) {
        return res.status(404).json({ message: 'Category not found' })
    }
    // 3- delete category
    await Category.findByIdAndDelete(req.params.id)
    // 4- send response to client
    res.status(200).json({ message: 'Category Deleted Successfully!' })
})
//! Update Category
/**
 * @desc Update Category
 * @route /api/categories/:id
 * @method PUT 
 * @access private (only admin)
 */
module.exports.updateCategoryCtrl = asyncHandler(async (req, res) => {

    // validatin
    const { error } = validateUpdateCategory(req.body)

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }



    // 1- get the comment from DB
    const category = await Category.findById(req.params.id)

    // 2- check if the category exist or no
    if (!category) {
        res.status(404).json({ message: "The category does not exists." })
    }




    // 3- check the user is the owner of the commnet or no
    if (req.user.isAdmin == category.user.toString()) {
        res.status(403).json({ message: "You can not edit this category" })
    }
    // 4- update category
    const updateCategory = await Category.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title
        }
    }, { new: true })
    // 5- send response to client
    res.status(200).json({
        message: "The category has been updated",
        updateCategory
    })
})