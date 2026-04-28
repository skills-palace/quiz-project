"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route = require('express').Router();
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
        const uploadPath = 'uploads/audios/';
        createUploadsFolder(uploadPath);
        cb(null, uploadPath); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // Generate a unique filename
    },
});
const upload = (0, multer_1.default)({ storage: storage });
// generate quiz
route.post('/generate', (0, auth_1.default)([1, 3]), upload.single('contentFile'), controllers_1.quizController.generateQuiz);
//------- category routes -------- // auth([1, 3, 4])
route.get('/', (0, auth_1.default)([1, 3]), controllers_1.quizController.index);
route.get('/:slug', (0, auth_1.default)([1, 3]), controllers_1.quizController.show);
route.get('/get-one/:id', (0, auth_1.default)([1, 3]), controllers_1.quizController.getOne);
route.post('/', (0, auth_1.default)([1, 3]), upload.fields([{ name: 'audioPath' }, { name: 'questionAudio' }]), controllers_1.quizController.store);
route.get('/edit/:id', (0, auth_1.default)([1, 3]), upload.fields([{ name: 'audioPath' }, { name: 'questionAudio' }]), controllers_1.quizController.edit);
route.patch('/:id', (0, auth_1.default)([1, 3]), upload.fields([{ name: 'audioPath' }, { name: 'questionAudio' }]), controllers_1.quizController.update);
route.delete('/:id', (0, auth_1.default)([1, 3]), controllers_1.quizController.destroy);
module.exports = route;
