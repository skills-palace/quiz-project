const route = require("express").Router();
import auth from "../middlewares/auth";
import { lessonController } from "../controllers";

import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Ensure the uploads directory exists
const createUploadsFolder = (folder: string): void => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    const uploadPath = "uploads/";
    createUploadsFolder(uploadPath);
    cb(null, uploadPath); // Specify the upload directory
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage: storage });

//------- category routes -------- //auth([1, 3, 4])
route.get("/list", auth([1, 3]), lessonController.index);
route.get("/", lessonController.getLessons);
route.post(
  "/cleanup-broken-images",
  auth([1]),
  lessonController.cleanupBrokenImages
);
route.get("/:title", lessonController.getLesson);
route.get("/edit/:id", auth([1, 3]), lessonController.showForEdit);
route.get("/log/:id", auth([1, 3, 4]), lessonController.getLessonLog);
route.get("/my_log/:id", auth([1, 2, 3, 4]), lessonController.getMyLessonLog);
route.patch(
  "/:id",
  auth([1, 3]),
  upload.fields([
    { name: "audioPath", maxCount: 1 }, // Field name for audio file
    { name: "imagePath", maxCount: 1 }, // Field name for image file
  ]),
  lessonController.update
);
route.delete("/:id", auth([1, 3]), lessonController.destroy);
route.post(
  "/",
  auth([1, 3]),
  upload.fields([
    { name: "audioPath", maxCount: 1 }, // Field name for audio file
    { name: "imagePath", maxCount: 1 }, // Field name for image file
  ]),
  lessonController.store
);
route.post(
  "/validate-quiz/:id",
  auth([1, 2, 3, 4]),
  lessonController.validateQuiz
);
module.exports = route;
