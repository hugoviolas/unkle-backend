const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./../models/User.model");
const saltRounds = 10;

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Auth" });
});

router.post("/signup", async (req, res, next) => {
  const { email, password, isAdmin } = req.body;
  if (email === "" || password === "") {
    return res.status(400).json({ errorMessage: "Missing credentials" });
  }
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPass = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      email,
      password: hashedPass,
      isAdmin,
    });
    const user = newUser.toObject();
    delete user.password;
    return res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    return res.status(400).json({ errorMessage: "Missing credentials" });
  }
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(401).json({ errorMessage: "Wrong credentials" });
      return;
    }
    const goodPass = bcrypt.compareSync(password, foundUser.password);
    if (goodPass) {
      const user = foundUser.toObject();
      delete user.password;
      console.log("===", process.env.TOKEN_SECRET);

      const authToken = jwt.sign(user, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "2d",
      });
      res.status(200).json({ authToken });
    } else {
      res.status(401).json({ errorMessage: "Wrong credentials" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Oh noes ! Something went terribly wrong !" });
  }
});

module.exports = router;
