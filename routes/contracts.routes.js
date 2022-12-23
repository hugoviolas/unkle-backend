const router = require("express").Router();
const isAuthenticated = require("./../middlewares/jwt.middleware");
const isLoggedIn = require("./../middlewares/isLoggedIn");
const isAdmin = require("./../middlewares/isAdmin");
const Contract = require("../models/Contract.model");
const Option = require("./../models/Option.model");
const User = require("./../models/User.model");

router.get("/", isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const allContracts = await Contract.find();
    res.status(200).json({ allContracts });
  } catch (error) {
    next(error);
  }
});

router.get("/user", isAuthenticated, isLoggedIn, (req, res, next) => {
  res.status(200).json({ message: "User" });
});

router.post("/new", isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    let { clients, number, status, start_date, end_date, options } = req.body;

    const foundContract = await Contract.findOne(
      { number: number },
      { projection: { _id: 1 } }
    );
    const foundOption = await Option.findOne({ description: options });
    const foundClient = await User.findOne({ email: clients });
    const now = new Date(Date.now()).toISOString();

    if (start_date <= now) {
      status = "active";
    } else if (start_date > now) {
      status = "pending";
    }

    if (end_date && end_date <= now) {
      status = "finished";
    }
    let newContract;

    if (foundContract) {
      newContract = await Contract.findByIdAndUpdate(foundContract, {
        $addToSet: { clients: foundClient._id },
        number,
        status,
        start_date,
        end_date,
        options: foundOption._id,
      });
    } else {
      newContract = await Contract.create({
        clients: foundClient._id,
        number,
        status,
        start_date,
        end_date,
        options: foundOption._id,
      });
    }
    return res.status(201).json({ newContract });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
