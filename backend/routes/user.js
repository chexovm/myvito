const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const auth = require('../middleware/auth');

router.post("/register", async (req, res) => {
    try {
        let { username, password, passwordCheck, email } = req.body;

        // validation
        if (!email || !password || !username || !passwordCheck)
            return res
                .status(400)
                .json({ msg: "Not all fields have been entered." });
        if (passwordCheck !== password)
            return res
                .status(400)
                .json({ msg: "Passwords do not match." });
        if (password.length < 5)
            return res
                .status(400)
                .json({ msg: "Passwords must be at least 5 characters long." });

        const existingUser = await User.findOne({ email: email });
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "An account with this email already exists." });

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashPassword,
            email,
        })
        const savedUser = await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)

        res.json({
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            }
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

router.post('/login', async (req, res) => {
    try {
        const { password, email } = req.body;

        //validation
        if (!password || !email)
            return res
                .status(400)
                .json({ msg: "Not all fields have been entered." });

        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(400)
                .json({ msg: "User with this email is not registered." });

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch)
            return res
                .status(400)
                .json({ msg: "Wrong password." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        username: user.username,
        id: user._id,
    });
});

module.exports = router;