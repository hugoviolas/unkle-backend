const isAdmin = (req, res, next) => {
  if (req.payload.isAdmin) {
    return next();
  } else {
    return res
      .status(401)
      .json({ errorMessage: "Can't access this route, your not an admin !" });
  }
};

module.exports = isAdmin;
