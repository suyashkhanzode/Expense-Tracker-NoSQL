const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.TOKEN_SECRET_KEY;

function generateAccessToken(user) {
  return jwt.sign({ user: user }, secretKey, { expiresIn: '1h' }); // Optional: Set token expiry
}

exports.signUpUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name: name,
      email: email,
      password: hash,
    });
    await newUser.save();
    res.status(201).json({ status: true, message: "User created successfully." });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.email) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }
    res.status(500).json({ message: "An error occurred during sign up.", error: err });
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found with provided email." });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.status(200).json({
        message: "User authenticated successfully.",
        token: generateAccessToken(user),
        isPremiumUser: user.isPremium,
      });
    } else {
      res.status(401).json({ message: "Invalid password." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while searching for the user.", error: error });
  }
};


exports.getTotalAmount = async (req, res, next) => {
    try {
        const result = await User.aggregate([
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    totalAmount: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { totalAmount: -1 }
            }
        ]);

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            message: "An error occurred while fetching total amounts",
            error: err
        });
    }
};

