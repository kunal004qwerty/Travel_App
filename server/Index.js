import * as dotenv from "dotenv";
dotenv.config();
// console.log(process.env.MONGOOS_URL);

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import pinRoute from "./routes/pins.js";
import userRoute from "./routes/users.js";

const app = express();

const MONGOOS_ATLES_URL = process.env.MONGOOS_URL;
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

mongoose
  .connect(MONGOOS_ATLES_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER running on PORT http://localhost:${PORT}/`);
    });
  })
  .catch((error) => console.log(error.message));
mongoose.set("strictQuery", true);
