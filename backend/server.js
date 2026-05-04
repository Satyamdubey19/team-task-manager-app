require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });
};

startServer();
