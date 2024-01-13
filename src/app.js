import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routers import
import router from "./routes/user.routes.js";
// const { router } = require("./routes/user.routes.js");
// Routers declaration

app.use("/api/v1/users",  router);

export default app ;
  