const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const { User, validateRegisterUser, validateLoginUser } = require('../models/UserModel')


// =================== Create a new user ===================
/**
 * @desc    Register new user
 * @route   /api/auth/register
 * @method  POST
 * @access  Public
 */

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
    //  validation
    const { error } = validateRegisterUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    //  is user already exist
    let user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).json({ message: "user already exsit" })
    }

    //  hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    //  new user and save it to BD

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    })
    await user.save()


    // @todo sending email ( verify account )



    //  send a response to client
    res.status(201).json({ message: 'You Registred Successfully , Please Login' })
})

// =================== Login user ===================
/**
 * @desc    Login user
 * @route   /api/auth/login
 * @method  POST
 * @access  Public
 */

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
    // validation 
    const { error } = validateLoginUser(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    // find user by email if exist or no
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ message: "User not found check your email or password" })
    }

    // check the password
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status(400).json({ message: "User not found check your email or password" })
    }
    // generate token (jwt)
    const token = user.generateAuthToken()

    // responseto client
    res.status(200).json({
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
        token: token,
    })
})