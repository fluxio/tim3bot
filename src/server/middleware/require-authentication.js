function requireAuthentication(req, res, next) {
  if (!req.session.passport) {
    res.sendStatus(401);
  } else {
    next();
  }
}

module.exports = requireAuthentication;
