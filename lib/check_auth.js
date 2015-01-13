module.exports = function(req, res, next) {
  if (!(req.session || {}).login) {
    return res.status(401).json({
      error: 'Not logged in'
    });
  }
  next();
};
