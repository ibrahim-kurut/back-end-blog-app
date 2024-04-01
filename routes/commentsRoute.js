const router = require('express').Router();
const { createCommentCtrl, getAllCommentsCtrl, deleteCommentsCtrl, updateCommentCtrl } = require('../controllers/commentController');
const validateObjectId = require('../middlewares/validateObjectId');
const { verifyToken, verifyTokenAndAdmin } = require('../middlewares/verifyToken');

// /api/comments

router.route('/').post(verifyToken, createCommentCtrl)

// get all comments
router.route('/').get(verifyTokenAndAdmin, getAllCommentsCtrl)

// /api/comments/:id
router.route("/:id")
    .delete(validateObjectId, verifyToken, deleteCommentsCtrl)
    .put(validateObjectId, verifyToken, updateCommentCtrl)


module.exports = router;