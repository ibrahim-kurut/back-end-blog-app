const router = require('express').Router();
const { createPostCtrl, getAllPostsCtrl, getSinglePostCtrl, getCountPostsCtrl, deletePostCtrl, upddatePostCtrl, toggleLikeCtrl } = require('../controllers/postController');
const photoUpload = require('../middlewares/photoUpload');
const validateImageCount = require('../middlewares/validateImageCount');
const validateObjectId = require('../middlewares/validateObjectId');
const { verifyToken } = require('../middlewares/verifyToken');


// /api/posts

// We want the user to upload a minimum of 5 photos and a maximum of 10 photos
// router.route('/').post(verifyToken, photoUpload.array('images', 10), validateImageCount, createPostCtrl)
//! for Add multiple image
// router.route('/')
//     .post(verifyToken, photoUpload.array('images', 1), createPostCtrl)
//     .get(getAllPostsCtrl);

router.route('/')
    .post(verifyToken, photoUpload.single('image'), createPostCtrl)
    .get(getAllPostsCtrl);

// /api/posts/count
router.route('/count').get(getCountPostsCtrl)

// /api/posts/:id
router.route('/:id')
    .get(validateObjectId, getSinglePostCtrl)
    .delete(validateObjectId, verifyToken, deletePostCtrl)
    .put(validateObjectId, verifyToken, upddatePostCtrl)


// /api/posts/like/:id
router.route('/like/:id').put(validateObjectId, verifyToken, toggleLikeCtrl)
module.exports = router