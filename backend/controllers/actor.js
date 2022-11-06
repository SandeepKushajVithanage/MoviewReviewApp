const Actor = require("../models/actor");
const { isValidObjectId } = require("mongoose");
const cloudinary = require("../cloud");
const {
  sendError,
  uploadImageToCloud,
  formatActor,
} = require("../utils/helper");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

exports.createActor = async (req, res) => {
  const {
    file,
    body: { name, about, gender },
  } = req;

  const newActor = new Actor({ name, about, gender });

  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newActor.avatar = { url, public_id };
  }

  await newActor.save();

  res.status(201).json(formatActor(newActor));
};

exports.updateActor = async (req, res) => {
  const {
    file,
    body: { name, about, gender },
  } = req;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");

  const actor = await Actor.findById(actorId);

  if (!actor) return sendError(res, "Invalid request, record not found!");

  const public_id = actor.avatar?.public_id;

  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);

    if (result !== "ok")
      return sendError(res, "Cloud not remove image from cloud!");
  }

  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    actor.avatar = { url, public_id };
  }

  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();

  res.status(200).json(formatActor(actor));
};

exports.removeActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");

  const actor = await Actor.findById(actorId);

  if (!actor) return sendError(res, "Invalid request, record not found!");

  const public_id = actor.avatar?.public_id;

  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);

    if (result !== "ok")
      return sendError(res, "Cloud not remove image from cloud!");
  }

  await Actor.findByIdAndDelete(actorId);

  res.json({ message: "Record removed successfully!" });
};

exports.searchActor = async (req, res) => {
  const { query } = req;
  const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
  const actors = result.map((actor) => formatActor(actor));
  res.json(actors);
};

exports.getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: "-1" }).limit(12);

  res.json(result);
};

exports.getSingleActor = async (req, res) => {
  const {
    params: { id },
  } = req;

  if (!isValidObjectId(id)) return sendError(res, "Invalid request!");

  const actor = await Actor.findById(id);

  if (!actor) return sendError(res, "Invalid request, actor not found!", 404);

  res.json(formatActor(actor));
};
