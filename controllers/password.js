const smtp = require("../utils/sendblue");
const ForgotPasswordRequest = require("../models/forgotPasswordRequest");
const bycript = require("bcrypt");
const User = require("../models/user");

require("dotenv").config();
const secertKey = process.env.TOKEN_SECRET_KEY;

exports.forgotPassword = async (req, res, next) => {
  const recieverMail = req.body.recieverMail;
  const user = await User.findOne({ email: recieverMail });
  const userId = user._id;
  const request = await ForgotPasswordRequest.create({ requestUUID: userId });
  debugger;
  const requestUUID = request.requestUUID;
  const resetURL = `http://localhost:3000/password/reset-password/${requestUUID}`;
  const html = `Click <a href ="${resetURL}">here</a>`;
  smtp
    .sendEmail(recieverMail, "Reset Password", "Your Reset Password Link", html)
    .then((result) => {
      res.status(200).json({ message: "Please Chech Your Inbox" });
    })
    .catch((err) => [
      res.status(500).json({
        message: "An error occurred while Sendin MAil",
        error: err,
      }),
    ]);
};

exports.resetPassword = async (req, res, next) => {
  const requestUUID = req.params.requestUUID;
  debugger;
  try {
    const request = await ForgotPasswordRequest.findOne({
      requestUUID: requestUUID,
    });
    if (!request) {
      return res
        .status(404)
        .json({ message: "Invalid or expired password reset link" });
    }

    ForgotPasswordRequest.updateOne({ requestUUID }, { isActive: false })

      .then(() => {
        t.commit();
        res
          .status(200)
          .send(
            `<a href="http://13.201.0.34/updatepassword.html?requestUUID=${requestUUID}">Click Here To Update Password</a>`
          );
      })
      .catch((err) => {
        t.rollback();
        console.log(err);
        res.status(500).json({ message: "An error occurred", error: err });
      });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.updatePassword = async (req, res, next) => {
  const newPassword = req.body.newPassword;
  const requestUUID = req.params.requestUUID;

  try {
    const request = await ForgotPasswordRequest.findOne({
      requestUUID: requestUUID,
    });

    if (!request || !request.isActive) {
      return res
        .status(404)
        .json({ message: "Invalid or expired password reset link" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const saltRounds = 10;
    const hashedPassword = bycript.hashSync(newPassword, saltRounds);
    debugger;
    await User.updateOne({ _id: user._id }, { password: hashedPassword });
    await ForgotPasswordRequest.updateOne({ requestUUID }, { isActive: false });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred while updating the password",
      error: err,
    });
  }
};
