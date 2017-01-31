module.exports = (io) => {
  return (req, res, next) => {
    req.io = io;
    next();
  }
}