const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const endpoint = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/unkle";

mongoose
  .connect(endpoint)
  .then((db) => console.log(`Connected to ${db.connection.name}`))
  .catch((e) => {
    console.log(e);
  });
