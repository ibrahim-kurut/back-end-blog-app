const router = require('express').Router();
const { createCommentCtrl, getAllCommentsCtrl } = require('../controllers/commentController');
const { verifyToken, verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// /api/comments

router.route('/').post(verifyToken, createCommentCtrl)

// get all comments
router.route('/').get(verifyTokenAndAdmin, getAllCommentsCtrl)


module.exports = router;