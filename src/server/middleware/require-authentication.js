function requireAuthentication(req, res, next) {
  if (!req.session.passport) {
    res.send(401);
  } else {
    next();
  }
}

module.exports = requireAuthentication;
