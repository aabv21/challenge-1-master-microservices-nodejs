// Packages
import dotenv from "dotenv";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

// Middlewares
import loggerMiddleware from "./middlewares/logger.js";
import responseHandler from "./middlewares/responseHandler.js";

// Load environment variables first
dotenv.config();

// Config
import "./config/mongo.js";
import "./config/redis.js";

// Rate Limiter with Debounce
const debounceTime = 1000; // 1 second debounce
let lastRequestTime = {};

const debounce = (req, res, next) => {
  const ip = req.ip;
  const currentTime = Date.now();

  if (lastRequestTime[ip] && currentTime - lastRequestTime[ip] < debounceTime) {
    return res.error("Please wait before making another request", 429);
  }

  lastRequestTime[ip] = currentTime;
  next();
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30, // Limit each IP to 30 requests per `window`
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Express
const app = express();

// Middleware
app.use(loggerMiddleware);
app.use(responseHandler);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(debounce); // Add debounce before rate limiter
app.use(limiter);

// Routes
import tasksRoutes from "./routes/tasksRoutes.js";
import usersRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Router
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/auth", authRoutes);

// Status 404
app.use((req, res) => {
  return res.error("[Server] Route not found", 404);
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  return res.error(message, status, err);
});

// Daemon
const server = http.createServer(app);
server.listen(process.env.PORT, () => {
  console.log(" ");
  console.log("--------------------------------");
  console.log(`[Server] is running on port ${process.env.PORT}`);
  console.log("--------------------------------");
  console.log(" ");
});
