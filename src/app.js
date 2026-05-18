const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/* There is all route files are imported */
const authRoutes = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* Use all routes file here */
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRouter);

module.exports = app;
