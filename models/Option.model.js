const { Schema, model } = require("mongoose");

const optionSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
});

const Option = model("Option", optionSchema);
module.exports = Option;
