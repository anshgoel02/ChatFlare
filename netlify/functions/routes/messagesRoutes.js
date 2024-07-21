const router = require("express").Router();
const { getAllMessages, addMessage } = require("../controllers/messagesController");

router.post("/getmessage", getAllMessages);
router.post("/addmessage", addMessage);

module.exports = router;