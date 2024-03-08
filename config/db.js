const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGOBD_URI)
        console.log("DB connected successfully ... ^_^");
    } catch (error) {
        console.log(`connection failed to DB: ${error}`);
    }
}

module.exports = dbConnection;