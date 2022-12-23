require("dotenv").config();
require("../config/dbConfig");
const Option = require("./../models/Option.model");
const options = require("./../seeds/options.json");
const mongoose = require("mongoose");

async function seedOptions() {
  try {
    await Option.deleteMany();
    const optionsSeeded = await Option.create(options);
    console.log("Seeded: ", optionsSeeded.length);
    mongoose.disconnect();
  } catch (error) {
    console.log(error);
  }
}

seedOptions();
