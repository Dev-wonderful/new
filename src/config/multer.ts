import multer, { StorageEngine } from "multer";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
import appRootPath from "app-root-path";
import { FileValidationError } from "../middleware";
dotenv.config();

const FILE_SIZE = 1024 * 1024 * 2; // 2MB
const ROOT = appRootPath.toString();

export const diskstorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(ROOT, "uploads/")),
  filename: (req, file, cb) => {
    console.log("file-a", file);
    return cb(null, req.body.fileName || file.originalname);
  },
});

export const memStorage = multer.memoryStorage();

if (!fs.existsSync(path.join(ROOT, "uploads/"))) {
  fs.mkdirSync(path.join(ROOT, "uploads/"));
}

export default function generateUploadMiddleware(storageType: StorageEngine) {
  return multer({
    storage: storageType,
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new FileValidationError("Only images are allowed"));
      }
      cb(null, true);
    },
    limits: { fileSize: FILE_SIZE },
  });
}
