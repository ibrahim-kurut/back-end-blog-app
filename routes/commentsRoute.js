const router = require('express').Router();
const { createCommentCtrl } = require('../controllers/commentController');
const { verifyToken } = require('../middlewares/verifyToken');

// /api/comments

router.route('/').post(verifyToken, createCommentCtrl)


module.exports = router;