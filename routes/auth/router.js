const express = require("express");
const router = express.Router();
const passport = require("passport");

const { validateSchema } = require("../../helper");
const { loginSchema } = require("./validation");
const { login, getMe, checkRefreshToken, basicLogin } = require("./controller");

router.route("/refresh-token").post(checkRefreshToken);

router.route("/login").post(
  validateSchema(loginSchema),
  passport.authenticate("local", { session: false }), //check email pass => có tồn tại ko , có tiếp tục
  login
);

router
  .route("/basic")
  .post(passport.authenticate("basic", { session: false }), basicLogin);

router
  .route("/profile")
  .get(passport.authenticate("jwt", { session: false }), getMe);

module.exports = router;
