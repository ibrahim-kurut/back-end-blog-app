const express = require('express');
const dotenv = require('dotenv');
const dbConnection = require('./config/db');

dotenv.config()

// db connection
dbConnection()

// init App
const app = express();

// middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/usersRoute'));
app.use('/api/posts', require('./routes/postsRoute'));
app.use('/api/comments', require('./routes/commentsRoute'));
app.use('/api/categories', require('./routes/categoriesRoute'));

// Running Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on ${process.env.NODE_ENV} mode on port ${port}`);
})