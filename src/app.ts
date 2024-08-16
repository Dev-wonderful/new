import cors from "cors";
import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { errorHandler, routeNotFound } from "./middleware";
import { Limiter } from "./utils";
import v1Router from "./routes";
import logger from "./utils/logger";

const app: Express = express();
app.options("*", cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  }),
);

app.use(Limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${req.ip}\n`,
    );
  });
  next();
});

const options = {
  explorer: true,
  swaggerOptions: {
    urls: [{ url: "/api/v1/docs/swagger.yaml", name: "version 1" }],
  },
};
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(null, options));

app.use("/api/v1", v1Router);

// app.use(routeNotFound);
app.use(errorHandler);

export default app;
