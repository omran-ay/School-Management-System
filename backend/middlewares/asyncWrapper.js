module.exports = (Fnasync) => {
  return (req, res, next) => {
    Fnasync(req, res, next).catch((err) => {
      next(err);
    });
  };
};
