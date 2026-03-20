import express from "express";
import path from "path";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/krunchy.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.USER_URL,
  process.env.DRIVER_URL,
  process.env.ADMIN_URL,
].filter(Boolean);
console.log(allowedOrigins);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

app.use("/", router);

app.use((err, res) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Order rooms
  socket.on("order:join", (orderId) => {
    socket.join(`order:${orderId}`);
    console.log(`Socket joined order:${orderId}`);
  });

  socket.on("order:leave", (orderId) => {
    socket.leave(`order:${orderId}`);
  });

  // Driver room

  socket.on("admin:join", () => {
    socket.join("admin");
    console.log(`Socket ${socket.id} joined admin room`);
  });

  socket.on("admin:leave", () => {
    socket.leave("admin");
  });

  // Admin room

  socket.on("driver:join", () => {
    socket.join("driver");
    console.log(`Socket ${socket.id} joined driver room`);
  });

  socket.on("driver:leave", () => {
    socket.leave("driver");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

export { io };
