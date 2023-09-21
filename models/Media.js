const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const mediaSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
mediaSchema.virtual("employee", {
  ref: "employees",
  localField: "employeeId",
  foreignField: "_id",
  justOne: true,
});
mediaSchema.set("toObject", { virtuals: true });
mediaSchema.set("toJSON", { virtuals: true });

const Media = model("Media", mediaSchema);
module.exports = Media;
