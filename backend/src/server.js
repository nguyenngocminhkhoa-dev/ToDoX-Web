import express from "express";
import taskRoute from "./routes/taskRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cros from "cors";
dotenv.config();
const app = express();

// middleware đọc JSON body

app.use(express.json());
//cho phép tất cả
app.use(cros());
//chỉ  cho một vào local
// app,use(cros({origin: ["",""]}))
// // Kết nối DB
// connectDB();
// MIDDLEWARE

// Routes
app.use("/api/tasks", taskRoute);
app.get("/", (req, res) => {
  res.send("Server đang chạy OK!");
});

// Server lắng nghe
connectDB().then(() => {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
  });
});
