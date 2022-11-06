const express = require("express");
const userRouter = require("./user");
const actorRouter = require("./actor");
const movieRouter = require("./movie");

const router = express.Router();

router.use("/user", userRouter);
router.use("/actor", actorRouter);
router.use("/movie", movieRouter);

module.exports = router;
