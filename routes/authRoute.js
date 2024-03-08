const router = require('express').Router()
const { registerUserCtrl } = require('../controllers/authController')

// /api/auth/register
router.post('/register', registerUserCtrl) // Register a new user to the database

module.exports = router;