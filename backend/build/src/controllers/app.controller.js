"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_model_1 = __importDefault(require("../models/user.model"));
const contact_message_model_1 = __importDefault(require("../models/contact-message.model"));
const nodemailer = require("nodemailer");
const appController = {
    dashboardHome(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userCount = yield user_model_1.default.aggregate([
                    {
                        $group: {
                            _id: "$role",
                            total: { $sum: 1 },
                        },
                    },
                ]);
                return res.status(200).json({
                    result: userCount,
                    message: "user count",
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    store(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, message } = req.body;
                if (!name || !email || !message) {
                    return res
                        .status(400)
                        .json({ message: "Name, email and message are required." });
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ message: "Please provide a valid email." });
                }
                if (String(message).trim().length < 10) {
                    return res
                        .status(400)
                        .json({ message: "Message should be at least 10 characters long." });
                }
                yield contact_message_model_1.default.create({
                    name: String(name).trim(),
                    email: String(email).trim().toLowerCase(),
                    message: String(message).trim(),
                });
                return res
                    .status(201)
                    .json({ message: "Your message has been sent successfully." });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    contactMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Math.max(Number(req.query.page) || 1, 1);
                const limit = Math.max(Number(req.query.limit) || 10, 1);
                const search = String(req.query.search || "").trim();
                const offset = limit * (page - 1);
                const query = search
                    ? {
                        $or: [
                            { name: { $regex: search, $options: "i" } },
                            { email: { $regex: search, $options: "i" } },
                            { message: { $regex: search, $options: "i" } },
                        ],
                    }
                    : {};
                const total = yield contact_message_model_1.default.countDocuments(query);
                const result = yield contact_message_model_1.default.find(query)
                    .sort({ createdAt: -1 })
                    .skip(offset)
                    .limit(limit);
                return res.status(200).json({
                    result,
                    total,
                    page,
                    limit,
                    offset,
                    count: result.length,
                });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    replyContactMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { reply } = req.body;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid message id." });
                }
                if (!reply || String(reply).trim().length < 3) {
                    return res
                        .status(400)
                        .json({ message: "Reply should be at least 3 characters long." });
                }
                const messageDoc = yield contact_message_model_1.default.findById(id);
                if (!messageDoc) {
                    return res.status(404).json({ message: "Message not found." });
                }
                const host = process.env.SMTP_HOST;
                const port = Number(process.env.SMTP_PORT || 587);
                const user = process.env.SMTP_USER;
                const pass = process.env.SMTP_PASS;
                const mailFrom = process.env.MAIL_FROM || user;
                if (!host || !user || !pass || !mailFrom) {
                    return res.status(500).json({
                        message: "Mail service is not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS and MAIL_FROM.",
                    });
                }
                const transporter = nodemailer.createTransport({
                    host,
                    port,
                    secure: port === 465,
                    auth: { user, pass },
                });
                yield transporter.sendMail({
                    from: mailFrom,
                    to: messageDoc.email,
                    subject: `Re: Contact message from ${messageDoc.name}`,
                    text: String(reply).trim(),
                });
                return res.status(200).json({ message: "Reply sent successfully." });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    deleteContactMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid message id." });
                }
                const deleted = yield contact_message_model_1.default.findByIdAndDelete(id);
                if (!deleted) {
                    return res.status(404).json({ message: "Message not found." });
                }
                return res.status(200).json({ message: "Message deleted successfully." });
            }
            catch (error) {
                return next(error);
            }
        });
    },
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () { });
    },
};
exports.default = appController;
