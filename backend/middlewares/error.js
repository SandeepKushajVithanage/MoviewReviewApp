const { sendError } = require("../utils/helper");

exports.errorHandler = (err, req, res, next) => {
  sendError(res, err.message || err, 500);
};
