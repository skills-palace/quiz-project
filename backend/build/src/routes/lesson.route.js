"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route = require("express").Router();
const auth_1 = __importDefault(require("../middlewares/auth"));
const controllers_1 = require("../controllers");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure the uploads directory exists
const createUploadsFolder = (folder) => {
    if (!fs_1.default.existsSync(folder)) {
        fs_1.default.mkdirSync(folder, { recursive: true });
    }
};
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "uploads/";
        createUploadsFolder(uploadPath);
        cb(null, uploadPath); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // Generate a unique filename
    },
});
const upload = (0, multer_1.default)({ storage: storage });
//------- category routes -------- //auth([1, 3, 4])
route.get("/list", (0, auth_1.default)([1, 3]), controllers_1.lessonController.index);
route.get("/", controllers_1.lessonController.getLessons);
route.post("/cleanup-broken-images", (0, auth_1.default)([1]), controllers_1.lessonController.cleanupBrokenImages);
route.get("/:title", controllers_1.lessonController.getLesson);
route.get("/edit/:id", (0, auth_1.default)([1, 3]), controllers_1.lessonController.showForEdit);
route.get("/log/:id", (0, auth_1.default)([1, 3, 4]), controllers_1.lessonController.getLessonLog);
route.get("/my_log/:id", (0, auth_1.default)([1, 2, 3, 4]), controllers_1.lessonController.getMyLessonLog);
route.patch("/:id", (0, auth_1.default)([1, 3]), upload.fields([
    { name: "audioPath", maxCount: 1 },
    { name: "imagePath", maxCount: 1 }, // Field name for image file
]), controllers_1.lessonController.update);
route.delete("/:id", (0, auth_1.default)([1, 3]), controllers_1.lessonController.destroy);
route.post("/", (0, auth_1.default)([1, 3]), upload.fields([
    { name: "audioPath", maxCount: 1 },
    { name: "imagePath", maxCount: 1 }, // Field name for image file
]), controllers_1.lessonController.store);
route.post("/validate-quiz/:id", (0, auth_1.default)([1, 2, 3, 4]), controllers_1.lessonController.validateQuiz);
module.exports = route;
