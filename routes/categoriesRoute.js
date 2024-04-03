const { createCategoryCtrl, getAllCategoryCtrl, deleteCategoryCtrl } = require('../controllers/categoriesControoler')
const validateObjectId = require('../middlewares/validateObjectId')
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken')

const router = require('express').Router()


// /api/categories
router.route('/').post(verifyTokenAndAdmin, createCategoryCtrl)

router.route('/').get(getAllCategoryCtrl)

// /api/categories/:id
router.route('/:id')
    .delete(validateObjectId, verifyTokenAndAdmin, deleteCategoryCtrl)


module.exports = router