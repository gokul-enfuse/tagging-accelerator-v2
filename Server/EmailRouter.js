const express = require("express");
const emailRouter = express.Router();
const nodemailer = require("nodemailer");
const Hogan = require('hogan.js')
const fs = require('fs');
const { dirname } = require("path");

const template = fs.readFileSync('./Email.hjs', 'utf-8')
const compiledTemplate = Hogan.compile(template);

// send mail
emailRouter.post("/user/reset", (req, res) => {
    const { email } = req.body;
    res.json({ result: "email sent" })
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sunandatest08@gmail.com",
                pass: "kazxxfhnycngvyjr"
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Reset your password",
            html: compiledTemplate.render({    }),
            attachments: [
                {
                    filename: 'enfuse-logo.png',
                    path: './enfuse-logo.png',
                    cid: "enfuse-logo"
                },
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error" + error)
            } else {
                res.status(201).json({ status: 201, info })
            }
        })

    } catch (error) {
        res.status(401).json({ status: 401, error })
    }
});




module.exports = emailRouter;