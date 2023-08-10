const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

const JWT_SECRETE = "E-SMART-DEV'S-SECRET";

// get all users using get "api/auth/". Doesn't Require auth
router.get("/", (req, res) => {
  let success = false;
  User.find()
    .then((users) => {
      res.json({ users, success: true });
    })
    .catch((err) => {
      res.json({
        msg: "Error Occurred",
        success
      });
    });
});
// ROUTE 1 : create a user using post "api/auth/". Doesn't Require auth
router.post(
  "/api/auth/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    // if there are errors return bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);

    // check whether the user with the same email exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry a user with this email already exists" });
    }
    // create a new user
    user = new User({
      name,
      email,
      password: securePassword,
    });
    // save the user to the database
    try {
      await user
        .save()
        .then((user) => {
          // JWT
          const authToken = jwt.sign({ id: user._id }, JWT_SECRETE);
          // res.json(user);
          success = true;
          res.json({ authToken, success });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ msg: "Internal Server Error", success });
        });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2 : authenticate a user using post "api/auth/login". Doesn't Require auth
router.post(
  "/api/auth/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    // if there are errors return bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password: plainPassword } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const password = user.password;
      const passwordCompare = await bcrypt.compare(plainPassword, password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      // JWT
      const authToken = jwt.sign({ id: user._id }, JWT_SECRETE);
      success = true;
      res.json({ success, authToken });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3 : get loggedin user details using post "api/auth/getuser". Require auth
router.post("/api/auth/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
