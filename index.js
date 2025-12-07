// import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import connectdb from "./config/db.js";

import authuser from "./routes/authroutes.js";
import taskRoutes from "./routes/taskroutes.js";
import timeroutes from "./routes/timeroutes.js";
import attendanceroutes from "./routes/attendanceroutes.js";
import leaveroutes from "./routes/leaveroutes.js";
import productivityroutes from "./routes/dailreprtroutes.js";
import adminRoutes from "./routes/adminroutes.js";
import notificationroutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentroutes.js";
import planRoutes from "./routes/planroutes.js";
import premiumRoutes from "./routes/premiumroutes.js";
import disputeroutes from "./routes/disputeroutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 🔥 IMPORTANT: add your frontend domain here for Render
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.onrender.com"
    ],
    credentials: true,
  })
);

// Connect DB
connectdb();

app.get("/", (req, res) => {
  res.send("WELCOME TO REMOTE WORK TRACKER");
});

// Routes
app.use("/api", authuser);
app.use("/api/tasks", taskRoutes);
app.use("/api/time", timeroutes);
app.use("/api/attendance", attendanceroutes);
app.use("/api/leave", leaveroutes);
app.use("/api/productivity", productivityroutes);
app.use("/admin", adminRoutes);
app.use("/api/notifications", notificationroutes);
app.use("/api/pay", paymentRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/disputes", disputeroutes);
app.use("/api/plans", planRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
