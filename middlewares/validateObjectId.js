const mongoose = require('mongoose');


//create function check id Is it objectId or not?
function validateObjectId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    next();
}

module.exports = validateObjectId;







