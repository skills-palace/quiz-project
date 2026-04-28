import dns from "node:dns";
import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

mongoose.set("strictQuery", false);

/** Optional: set `DNS_SERVERS=8.8.8.8,1.1.1.1` in `.env` if `querySrv ECONNREFUSED` persists (SRV lookup). */
function applyOptionalDnsServers() {
  const raw = process.env.DNS_SERVERS?.trim();
  if (!raw) return;
  dns.setServers(raw.split(",").map((s) => s.trim()).filter(Boolean));
}

export async function connectDB() {
  applyOptionalDnsServers();
  const uri = config.get<string>("DB_URL");

  try {
    await mongoose.connect(uri, {
      family: 4,
      serverSelectionTimeoutMS: 20_000,
    });
    logger.info("DB connected");
  } catch (error) {
    logger.error(
      { err: error },
      "Could not connect to DB. If you see querySrv ECONNREFUSED, try DNS_SERVERS=8.8.8.8,1.1.1.1 in .env or use Atlas's non-SRV connection string."
    );
    throw error;
  }
}

export default connectDB;
