const Message = require("../models/messageModel");
const User = require("../models/userModel");

module.exports.getAllMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await Message.find({
            users: {
                $all: [from, to]
            }
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            };
        });

        res.json(projectedMessages);
    }
    catch (e) {
        next(e);
    }
}

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = new Message({
            message: { text: message },
            users: [from, to],
            sender: from
        });

        const response = await data.save();
        if (response) {
            return res.json({ msg: "Message added successfully" });
        }
        return res.json({ msg: "Failed to add message to the database" });
    }
    catch (e) {
        next(e);
    }
}