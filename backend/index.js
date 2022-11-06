require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const { handleNotFound } = require("./utils/helper");
const { errorHandler } = require("./middlewares/error");

require("./db");

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

app.use("/*", handleNotFound);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}/`);
});
