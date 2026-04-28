"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let path = "src/public/image/";
        return cb(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const filetypes = /jpeg|jpg|png/;
const fileFilter = (req, file, cb) => {
    if (filetypes.test(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb({ message: "file type not allowed to upload" }, false);
    }
};
const uploader = (0, multer_1.default)({
    storage,
    fileFilter,
    // limits: { files: 1, fileSize: 1024 ** 2 * 5 }, // 5mb
}).single("file");
const uploadFile = (req, res, next) => {
    uploader(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            const data = { message: err.message, code: 500, success: false };
            if (err.code == "LIMIT_FILE_SIZE") {
                data.message = "File Size is too large. Allowed file size is 5mb";
            }
            return res.status(500).json(data);
        }
        else if (err) {
            const data = { message: err.message, code: 500, success: false };
            return res.status(500).json(data);
        }
        next();
    });
};
exports.default = uploadFile;
//export default uploader;
