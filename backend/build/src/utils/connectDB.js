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
exports.connectDB = void 0;
const node_dns_1 = __importDefault(require("node:dns"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
mongoose_1.default.set("strictQuery", false);
/** Optional: set `DNS_SERVERS=8.8.8.8,1.1.1.1` in `.env` if `querySrv ECONNREFUSED` persists (SRV lookup). */
function applyOptionalDnsServers() {
    var _a;
    const raw = (_a = process.env.DNS_SERVERS) === null || _a === void 0 ? void 0 : _a.trim();
    if (!raw)
        return;
    node_dns_1.default.setServers(raw.split(",").map((s) => s.trim()).filter(Boolean));
}
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        applyOptionalDnsServers();
        const uri = config_1.default.get("DB_URL");
        try {
            yield mongoose_1.default.connect(uri, {
                family: 4,
                serverSelectionTimeoutMS: 20000,
            });
            logger_1.default.info("DB connected");
        }
        catch (error) {
            logger_1.default.error({ err: error }, "Could not connect to DB. If you see querySrv ECONNREFUSED, try DNS_SERVERS=8.8.8.8,1.1.1.1 in .env or use Atlas's non-SRV connection string.");
            throw error;
        }
    });
}
exports.connectDB = connectDB;
exports.default = connectDB;
