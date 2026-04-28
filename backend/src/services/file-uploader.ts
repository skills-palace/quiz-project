import { Request, Response, NextFunction } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = "src/public/image/";
    return cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const filetypes = /jpeg|jpg|png/;

const fileFilter = (req: any, file: any, cb: any) => {
  if (filetypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb({ message: "file type not allowed to upload" }, false);
  }
};

const uploader = multer({
  storage,
  fileFilter,
  // limits: { files: 1, fileSize: 1024 ** 2 * 5 }, // 5mb
}).single("file");

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  uploader(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      const data = { message: err.message, code: 500, success: false };
      if (err.code == "LIMIT_FILE_SIZE") {
        data.message = "File Size is too large. Allowed file size is 5mb";
      }
      return res.status(500).json(data);
    } else if (err) {
      const data = { message: err.message, code: 500, success: false };
      return res.status(500).json(data);
    }
    next();
  });
};

export default uploadFile;
//export default uploader;
