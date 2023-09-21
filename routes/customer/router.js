const express = require("express");
const router = express.Router();

const { validateSchema } = require("../../helper");
const { getDetailSchema, createSchema } = require("./validation");
const { getAll, getDetail, create, remove, update } = require("./controller");
const passport = require("passport");

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getAll)
  .post(validateSchema(createSchema), create);

router
  .route("/:id")
  .get(validateSchema(getDetailSchema), getDetail)
  .patch(validateSchema(createSchema), update)
  .delete(validateSchema(getDetailSchema), remove);

module.exports = router;
