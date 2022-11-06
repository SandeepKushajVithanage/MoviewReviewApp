const { sendError } = require("../utils/helper");
const cloudinary = require("../cloud");

exports.uploadTrailer = async (req, res) => {
  const { file } = req;
  if (!file) return sendError(res, "Video file is missing!");
  console.log(file);
  const videoRes = await cloudinary.uploader.upload(file.path, {
    resource_type: "raw",
  });

  res.json(videoRes);
};
