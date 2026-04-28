"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const connectDB_1 = __importDefault(require("./utils/connectDB"));
const logger_1 = __importDefault(require("./utils/logger"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const port = config_1.default.get("PORT");
const app = (0, express_1.default)();
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
    origin: function (origin, callback) {
        // Check if the origin is in the list of allowed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOption));
const staticOption = {
    dotfiles: "ignore",
    etag: true,
    index: false,
    redirect: false,
};
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
});
app.use("/api/file", express_1.default.static("src/public", staticOption));
const staticUploadTargets = ["/upload", "/uploads"];
const uploadDirs = ["upload", "uploads"];
for (const route of staticUploadTargets) {
    for (const dir of uploadDirs) {
        const absoluteDir = path_1.default.resolve(process.cwd(), dir);
        if (fs_1.default.existsSync(absoluteDir)) {
            app.use(route, express_1.default.static(absoluteDir, staticOption));
        }
    }
}
(0, routes_1.default)(app);
app.use(errorHandler_1.default);
function connectDbWithRetry(delayMs = 15000) {
    return __awaiter(this, void 0, void 0, function* () {
        // Keep retrying DB connection so the API process stays alive for nginx.
        while (true) {
            try {
                yield (0, connectDB_1.default)();
                return;
            }
            catch (err) {
                logger_1.default.error({ err }, `DB connect failed; retrying in ${Math.round(delayMs / 1000)}s`);
                yield new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            const server = app.listen(port, () => {
                logger_1.default.info(`App is listening at http://localhost:${port}`);
                resolve();
            });
            server.on("error", reject);
        });
        void connectDbWithRetry();
    });
}
start().catch((err) => {
    logger_1.default.error({ err }, "Server failed to start");
    process.exit(1);
});
