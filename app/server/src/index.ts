import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import cors from "cors";
import helmet from "helmet";

import morgan from "morgan";

import itemRoute from "./routes/itemRoute";
import authRoute from "./routes/userRoute"
/* CONFIGURATIONS */
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.MONGO_DB) {
  mongoose
    .connect(process.env.MONGO_DB)
    .then((result) => {
      console.log("connected to Mongodb");
    })
    .catch((err) => {
      console.error(err);
    });
}

/* ROUTES */
/* ROUTES */
const apiRouter = express.Router();

// Mount routes to apiRouter
apiRouter.use("/items", itemRoute);
apiRouter.use("/auth", authRoute);  // Use authRoute here, not itemRoute

// Mount apiRouter to app with /api prefix
app.use("/api", apiRouter);


/* SERVER */
const port = process.env.PORT || 8000;

if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
