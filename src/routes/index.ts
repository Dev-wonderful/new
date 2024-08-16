import { Router, Response, Request } from "express";
import authRouter from "./auth";
import adminRouter from "./admin";
import fs from "fs";
import YAML from "yaml";
import path from "path";
import appRootPath from "app-root-path";

// const file = fs.readFileSync(path.join(appRootPath.toString(), 'swagger.yaml'), 'utf8')
// const swaggerDocument = YAML.parse(file)

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/admin", adminRouter);

v1Router.get(`/docs/swagger.yaml`, (req: Request, res: Response) => {
  const swaggerFile = fs.readFileSync(
    path.join(appRootPath.toString(), "swagger.yaml"),
    "utf8",
  );
  console.log(swaggerFile);
  res.setHeader("Content-Type", "text/yaml");
  res.send(swaggerFile);
});

export default v1Router;
