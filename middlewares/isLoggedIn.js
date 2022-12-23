const isLoggedIn = (req, res, next) => {
  if (req.payload) {
    next();
  } else {
    return res.status(401).json({ errorMessage: "You're not logged in" });
  }
};

module.exports = isLoggedIn;
