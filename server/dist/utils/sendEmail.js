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
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplate_1 = require("./emailTemplate");
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, //true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, //your SMTP email user
        pass: process.env.EMAIL_PASS, // your SMTP email password
    },
});
const sendVerificationEmail = (to_1, verificationToken_1, ...args_1) => __awaiter(void 0, [to_1, verificationToken_1, ...args_1], void 0, function* (to, verificationToken, text = "") {
    // const url = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    try {
        const info = yield transporter.sendMail({
            from: `"classyShop" ${process.env.EMAIL_USER}`, // sender address
            to,
            subject: 'Verify Your Email',
            text,
            // html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
            html: emailTemplate_1.VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
        });
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        console.error("Error while sending email:", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
