import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import User from "../models/user.model";
import ContactMessage from "../models/contact-message.model";
const nodemailer = require("nodemailer");

const appController = {
  async dashboardHome(req: Request, res: Response, next: NextFunction) {
    try {
      const userCount = await User.aggregate([
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
    } catch (error) {
      return next(error);
    }
  },

  async store(req: Request, res: Response, next: NextFunction) {
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

      await ContactMessage.create({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        message: String(message).trim(),
      });

      return res
        .status(201)
        .json({ message: "Your message has been sent successfully." });
    } catch (error) {
      return next(error);
    }
  },
  async contactMessages(req: Request, res: Response, next: NextFunction) {
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

      const total = await ContactMessage.countDocuments(query);
      const result = await ContactMessage.find(query)
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
    } catch (error) {
      return next(error);
    }
  },
  async replyContactMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reply } = req.body;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid message id." });
      }

      if (!reply || String(reply).trim().length < 3) {
        return res
          .status(400)
          .json({ message: "Reply should be at least 3 characters long." });
      }

      const messageDoc = await ContactMessage.findById(id);
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
          message:
            "Mail service is not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS and MAIL_FROM.",
        });
      }

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: mailFrom,
        to: messageDoc.email,
        subject: `Re: Contact message from ${messageDoc.name}`,
        text: String(reply).trim(),
      });

      return res.status(200).json({ message: "Reply sent successfully." });
    } catch (error) {
      return next(error);
    }
  },
  async deleteContactMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid message id." });
      }

      const deleted = await ContactMessage.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Message not found." });
      }

      return res.status(200).json({ message: "Message deleted successfully." });
    } catch (error) {
      return next(error);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {},
  async destroy(req: Request, res: Response, next: NextFunction) {},
};

export default appController;
