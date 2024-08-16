// import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import config from "./config";
import log from "./utils/logger";

dotenv.config();

const port = config.port;

app.listen(port, () => {
  log.info(`Server is listening on port ${port}`);
});
