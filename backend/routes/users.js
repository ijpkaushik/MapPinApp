const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: hashPassword,
	});

	try {
		const savedUser = await newUser.save();
		res.status(200).json(savedUser);
	} catch (error) {
		res.status(500).json(error);
	}
});

//LOGIN
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user) return res.status(404).json("user does not exsist");

		const validatedPwd = await bcrypt.compare(req.body.password, user.password);
		if (!validatedPwd) return res.status(400).json("wrong password");

		const { password, ...others } = user._doc;

		return res.status(200).json(others);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
