const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');;
require("dotenv").config();

// setting up express
const app = express();

// middleware
app.use(express.json())
app.use(cors())

// setting port
const PORT = process.env.PORT || 5000;

// launching express
app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

// setting up mongoose

mongoose.connect(
    process.env.MONGODB_CONNECTION_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }, (err) => {
        if (err) throw err;
        console.log("MongoDB connected");
    }
)

// setting up routes

app.use('/api/user/', require('./routes/user'))