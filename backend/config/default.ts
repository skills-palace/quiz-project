const parsedPort = Number(process.env.PORT);
const port =
  Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 5000;

export default {
  DEBUG_MODE: true,
  PORT: port,
  DB_URL: process.env.DB_URL,
  JWT: {
    SECRET: process.env.JWT_SECRET,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    RESET_SECRET: process.env.JWT_RESET_SECRET,
    ACC_ACTIVATION: process.env.JWT_ACC_ACTIVATION,
    ACCESS_TOKEN_TIME: "15m",
    REFRESH_TOKEN_TIME: "1y",
  },
};
