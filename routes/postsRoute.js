const { createPostCtrl, getAllPostsCtrl } = require('../controllers/postController');
const photoUpload = require('../middlewares/photoUpload');
const validateImageCount = require('../middlewares/validateImageCount');
const validateObjectId = require('../middlewares/validateObjectId');
const { verifyToken } = require('../middlewares/verifyToken');

const router = require('express').Router();

// /api/posts

// We want the user to upload a minimum of 5 photos and a maximum of 10 photos
// router.route('/').post(verifyToken, photoUpload.array('images', 10), validateImageCount, createPostCtrl)
router.route('/')
    .post(verifyToken, photoUpload.array('images', 1), createPostCtrl)
    .get(getAllPostsCtrl);
module.exports = router