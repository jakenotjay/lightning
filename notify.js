const nodemailer = require('nodemailer');
const accountSid = process.env.twilioSid;
const authToken = process.env.twilioAuth;
const autoEmailName = process.env.autoEmailName;
const autoEmailPW = process.env.autoEmailPW;
const twilioPhoneNum = process.env.twilioPhoneNum;
const client = require('twilio')(accountSid, authToken);
const emailList = "jw01170@surrey.ac.uk";
const phoneList = "+447375051018";

async function emailAlert(message) {
    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
            user: autoEmailName,
            pass: autoEmailPW
        }
    });

    let info = await transporter.sendMail({
        from: '"Lightning notifier" <lightning.notify@outlook.com>',
        to: emailList,
        subject: message,
        text: "Check the reports website for new report information - https://lightningflash.co.uk"
    });

    console.log("Message send: %s", info.messageId);
}

async function textAlert(message) {
    client.messages.create({
        body: message + '\n https://lightningflash.co.uk',
        from: twilioPhoneNum,
        to: phoneList
    }).then(message => console.log(message.sid));
}

async function notifyReport(strikeData, triangulated) {
    let message;
    if(triangulated) {
        message = 'TRIANGULATED Report - ' + strikeData.dateTime + ' - ' + strikeData.location
    } else {
        message = 'Unconfirmed Lightning Report - ' + strikeData.dateTime + ' - ' + strikeData.location
    }
    emailAlert(message);
    textAlert(message);
}
module.exports = {
    notifyReport: notifyReport
}