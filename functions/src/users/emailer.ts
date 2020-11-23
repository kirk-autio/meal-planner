import * as mailer from "nodemailer";

export class emailer {
    private static GMAIL_IAM = {user: "kirk.autio@gmail.com", pass: "whmcqalwdsrdlfzw"};

    static async send(to: string, subject: string, message: string) : Promise<boolean> {
        let result: boolean = false;

        const transporter = mailer.createTransport({
            service: "gmail",
            auth: {
                user: this.GMAIL_IAM.user,
                pass: this.GMAIL_IAM.pass
            }
        });
        
        const mailOptions = {
            from: "kirk.autio@gmail.com",
            to: to,
            subject: subject,
            text: message 
        };

        transporter.sendMail(mailOptions, (error) => result = error === null);
        return result;
    }
}