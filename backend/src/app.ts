require("dotenv").config();
import express from "express";
import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import connectDB from "./utils/connectDB";
import logger from "./utils/logger";
import routes from "./routes";
import ErrorHandler from "./middlewares/errorHandler";

const port = config.get<number>("PORT");

const app = express();

const allowedOrigins = [
  "https://skillspalace.com",
  "https://www.skillspalace.com",
  "https://skillspalce.com",
  "https://www.skillspalce.com",
  "http://localhost:3000",
  "http://skillspalace.com",
  "http://www.skillspalace.com",
  "http://skillspalce.com",
  "http://www.skillspalce.com",
  "http://192.168.4.20:3000",
];
const corsOption = {
  origin: function (origin: any, callback: any) {
    // Check if the origin is in the list of allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOption));
const staticOption = {
  dotfiles: "ignore",
  etag: true,
  index: false,
  redirect: false,
};

app.use(express.json());

app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/file", express.static("src/public", staticOption));

const staticUploadTargets = ["/upload", "/uploads"];
const uploadDirs = ["upload", "uploads"];

for (const route of staticUploadTargets) {
  for (const dir of uploadDirs) {
    const absoluteDir = path.resolve(process.cwd(), dir);
    if (fs.existsSync(absoluteDir)) {
      app.use(route, express.static(absoluteDir, staticOption));
    }
  }
}

routes(app);

app.use(ErrorHandler);

async function connectDbWithRetry(delayMs = 15_000) {
  // Keep retrying DB connection so the API process stays alive for nginx.
  while (true) {
    try {
      await connectDB();
      return;
    } catch (err) {
      logger.error(
        { err },
        `DB connect failed; retrying in ${Math.round(delayMs / 1000)}s`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function start() {
  await new Promise<void>((resolve, reject) => {
    const server = app.listen(port, () => {
      logger.info(`App is listening at http://localhost:${port}`);
      resolve();
    });
    server.on("error", reject);
  });
  void connectDbWithRetry();
}

start().catch((err) => {
  logger.error({ err }, "Server failed to start");
  process.exit(1);
});
