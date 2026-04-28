const route = require('express').Router();
import auth from '../middlewares/auth';
import { quizController } from '../controllers';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Ensure the uploads directory exists
const createUploadsFolder = (folder: string): void => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    const uploadPath = 'uploads/audios/';
    createUploadsFolder(uploadPath);
    cb(null, uploadPath); // Specify the upload directory
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage: storage });
// generate quiz
route.post(
  '/generate',
  auth([1, 3]),
  upload.single('contentFile'),
  quizController.generateQuiz
);

//------- category routes -------- // auth([1, 3, 4])
route.get('/', auth([1, 3]), quizController.index);
route.get('/:slug', auth([1, 3]), quizController.show);
route.get('/get-one/:id', auth([1, 3]), quizController.getOne);
route.post(
  '/',
  auth([1, 3]),
  upload.fields([{ name: 'audioPath' }, { name: 'questionAudio' }]),
  quizController.store
);
route.get(
  '/edit/:id',
  auth([1, 3]),
  upload.fields([{ name: 'audioPath' }, { name: 'questionAudio' }]),
  quizController.edit
);
route.patch(
  '/:id',
  auth([1, 3]),
  upload.fields([{ name: 'audioPath' }, { name: 'questionAudio' }]),
  quizController.update
);
route.delete('/:id', auth([1, 3]), quizController.destroy);

module.exports = route;
