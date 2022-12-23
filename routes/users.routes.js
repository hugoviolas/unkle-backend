const isLoggedIn = require("../middlewares/isLoggedIn");
const isAuthenticated = require("../middlewares/jwt.middleware");
const Contract = require("./../models/Contract.model");

const router = require("express").Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/:id", isAuthenticated, isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const foundContracts = await Contract.find({ clients: id })
    .populate("options")
    .exec();
  res.status(200).json({ foundContracts });
});

module.exports = router;
