const validateImageCount = (req, res, next) => {
    // Check if at least 5 images are uploaded
    if (!req.files || req.files.length < 5) {
        return res.status(400).json({ message: "At least 5 images are required" });
    }
    next();
};

module.exports = validateImageCount;