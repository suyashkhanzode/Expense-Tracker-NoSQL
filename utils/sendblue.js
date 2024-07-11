const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = Sib.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.sendEmail = async (to, subject, textContent,htmlContent) => {
    const sendSmtpMail = new Sib.SendSmtpEmail();

    sendSmtpMail.sender = { email: process.env.SENDER_EMAIL, name: 'Expense Tracker' };
    sendSmtpMail.to = [{ email: to }];
    sendSmtpMail.subject = subject;
    sendSmtpMail.textContent = textContent;
    sendSmtpMail.htmlContent = htmlContent; 

    try {
        const data = await tranEmailApi.sendTransacEmail(sendSmtpMail);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
};
