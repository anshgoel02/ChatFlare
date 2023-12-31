const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    // console.log(req.body);
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });

        if (usernameCheck) {
            return res.json({ message: "Username already used", status: false });
        }
        const emailCheck = await User.findOne({ email });

        if (emailCheck) {
            return res.json({ message: "Email already used", status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // const user = await User.create({
        //     email,
        //     username,
        //     password: hashedPassword
        // });

        const user = new User({
            email,
            username,
            password: hashedPassword
        });

        await user.save();

        delete user.password;
        return res.status(200).json({ status: true, user });
    }
    catch (e) {
        next(e);
    }
}