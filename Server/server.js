import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
import OrderRoutes from "./routes/orderRoutes.js";
import webhookRouter from "./routes/webhookRouter.js";

const server = express();
dotenv.config();

// Middleware
server.use(cors());

//**Use express.raw() ONLY for the webhook route**
   server.use("/api/webhook", express.raw({ type: "application/json" }));

// Use bodyParser.json() for all other routes
server.use(bodyParser.json());

// Database connection
const PORT = process.env.PORT;
const URL = process.env.DATABASE_URL;

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to DATABASE");

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err.message));

// Routes
server.use("/api/user", userRoutes);
server.use("/api/admin", adminRoute);
server.use("/api/orders", OrderRoutes);
server.use("/api", webhookRouter);

