import nodemailer from "nodemailer";
import { generateTemplateProductStatus } from "../templates/templateNewProduct";
import { templeteCadastroUsuário } from "../templates/templeteCadastroUsuário";


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

    async send(to: string, subject: string, productName: string, filialName: string, status: "saindo" | "chegou") {
        await this.transport.sendMail({
            from: "tiago@gmail.com", // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            //text: text, // plain text body
            html: generateTemplateProductStatus(productName, filialName, status), // html body
        });
    }
    async sendUser(to: string, subject: string, nameUser: string) {
        await this.transport.sendMail({
            from: "tiago@gmail.com", // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            //text: text, // plain text body
            html: templeteCadastroUsuário(nameUser), // html body
        });
    }



}

export default SendEmail;