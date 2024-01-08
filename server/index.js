const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");


const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

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

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        // console.log(onlineUsers);
    });

    socket.on("send-message", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        // console.log("send-message", data);

        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    });
})