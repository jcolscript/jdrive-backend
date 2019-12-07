const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const util = require('util');
const hbs = require('nodemailer-express-handlebars');

exports.sendMail = async (data) => {
    if (!data.template) {
        throw new Error('Não há template de e-mail');
    }

    const transport = await nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        connectionTimeout: 5000,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const text = await htmlToText.fromString(data.template);
    transport.use('compile', hbs({
        viewEngine: {
            extName: '.html',
            partialsDir: 'src/templates/',
            layoutsDir: 'src/templates/',
            defaultLayout: 'registration.html',
        },
        viewPath: 'src/templates/',
        partialsDir: 'src/templates/',
        layoutsDir: 'src/templates/',
        extName: '.html',
    }));

    const mailOptions = {
        from: 'JDrive <no-reply@jdrive.com.br>',
        to:data.destino,
        bcc: 'jcolscript@gmail.com',
        subject: data.assunto,
        template: data.template,
        context: data.context,
        domain: 'jdrive.com',
        text,
    };

    const sendMail = await util.promisify(transport.sendMail).bind(transport);
    return sendMail(mailOptions);
}
