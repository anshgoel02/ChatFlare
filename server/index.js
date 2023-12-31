const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');


const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB connection successful");
    })
    .catch((error) => {
        console.log(error.message);
    })
// mongoose.set('useNewUrlParser', true);

const server = app.listen(process.env.PORT, () => {
    console.log("Listening at port", process.env.PORT);
})
