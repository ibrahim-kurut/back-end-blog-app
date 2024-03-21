const router = require('express').Router();
const { createPostCtrl, getAllPostsCtrl, getSinglePostCtrl, getCountPostsCtrl, deletePostCtrl } = require('../controllers/postController');
const photoUpload = require('../middlewares/photoUpload');
const validateImageCount = require('../middlewares/validateImageCount');
const validateObjectId = require('../middlewares/validateObjectId');
const { verifyToken } = require('../middlewares/verifyToken');


// /api/posts

// We want the user to upload a minimum of 5 photos and a maximum of 10 photos
// router.route('/').post(verifyToken, photoUpload.array('images', 10), validateImageCount, createPostCtrl)
router.route('/')
    .post(verifyToken, photoUpload.array('images', 1), createPostCtrl)
    .get(getAllPostsCtrl);

// /api/posts/count
router.route('/count').get(getCountPostsCtrl)

// /api/posts/:id
router.route('/:id')
    .get(validateObjectId, getSinglePostCtrl)
    .delete(validateObjectId, verifyToken, deletePostCtrl)

module.exports = router