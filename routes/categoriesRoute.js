const { createCategoryCtrl, getAllCategoryCtrl } = require('../controllers/categoriesControoler')
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken')

const router = require('express').Router()


// /api/categories
router.route('/').post(verifyTokenAndAdmin, createCategoryCtrl)

router.route('/').get(getAllCategoryCtrl)


module.exports = router