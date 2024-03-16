const jwt = require('jsonwebtoken')

// Verify Token
function verifyToken(req, res, next) {
    // Get token from header
    const authToken = req.headers.authorization

    if (authToken) {
        const token = authToken.split(' ')[1]
        // Check if not token was provided
        try {
            // Verify the token
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)
            // Create new object in request
            req.user = decodedPayload
            // Go to the next middleware function in the chain
            next()
        } catch (error) {
            return res.status(401).json({ message: "invalid token, access  denied" })
        }
    } else {
        return res.status(401).json({ message: "No token provided, access  denied" })
    }
}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json({ message: "You are not admin!" })
        }
    })
}

// Verify Token & Only User Himself
function verifyTokenAndOnlyUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next()
        } else {
            return res.status(403).json({ message: "Only the user himself can update this account" })
        }
    })
}


module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser
};
