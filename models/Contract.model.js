const { Schema, model } = require("mongoose");

const contractSchema = new Schema({
  clients: [
    {
      type: Schema.Types.ObjectId,
      required: true,
    },
  ],
  number: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "active", "finished"],
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
  },
  options: {
    type: [Schema.Types.ObjectId],
    required: true,
    immutable: true,
    ref: "Option",
  },
});

const Contract = model("Contract", contractSchema);
module.exports = Contract;
