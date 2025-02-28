import nodemailer from "nodemailer";
import { generateTemplateNewProduct } from "../templates/templateNewProduct";

class SendEmail {
    private transport: nodemailer.Transporter;

    constructor() {
        this.transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(to: string, subject: string, productName: string) {
        await this.transport.sendMail({
            from: "henrique@gmail.com", // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            //text: text, // plain text body
            html: generateTemplateNewProduct(productName), // html body
        });
    }
}

export default SendEmail;