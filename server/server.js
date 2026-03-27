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

const allowedOrigins = process.env.FRONT_END_URLs.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("Blocked origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
/*
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
*/

app.use((req, res, next) => {
  console.log("Origin received:", req.headers.origin);
  next();
});

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use(cookieParser());

app.use((err, res) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});
app.use("/", router);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // Order rooms
  socket.on("order:join", (orderId) => {
    socket.join(`order:${orderId}`);
  });

  socket.on("order:leave", (orderId) => {
    socket.leave(`order:${orderId}`);
  });

  // Driver room

  socket.on("admin:join", () => {
    socket.join("admin");
  });

  socket.on("admin:leave", () => {
    socket.leave("admin");
  });

  // Admin room

  socket.on("driver:join", () => {
    socket.join("driver");
  });

  socket.on("driver:leave", () => {
    socket.leave("driver");
  });

  socket.on("disconnect", () => {});
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
