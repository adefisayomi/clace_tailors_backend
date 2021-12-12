const Email = require('email-templates')
const nodemailer = require('nodemailer')


module.exports = async ({sender, from,  replyTo, to, title, file, content}) => {
    try {
        // nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          })
        
        // init Email object
        const email = new Email({
            transport: transporter,
            send: true,
            preview: false,
            views: {
                options: {
                    extension: 'ejs'
                },
                root: process.cwd() + `/views/templates/`
            },
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    relativeTo: process.cwd() + `/views/static/`
                }
            }
        })

        // send the email
        const sent = await email.send({
            message: {
                from: from || 'Good guys of clace-academy claceey@gmail.com',
                to,
                sender: sender || 'claceey@gmail.com',
                replyTo: replyTo || 'claceey@gmail.com',
            },
            locals: content,
            template: file,
        })

        return ({
            success: true,
            message: 'message sent successfuly',
            data: sent
        })
    }
    catch(err) {
        return ({
            success: false,
            message: err.message,
            data: null
        })
    }
}