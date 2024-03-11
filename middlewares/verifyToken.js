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
module.exports = {
    verifyToken
};