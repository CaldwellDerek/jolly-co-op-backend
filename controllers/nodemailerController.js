require("dotenv").config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { callbackPromise } = require('nodemailer/lib/shared');


router.post('/',(req,res)=>{
    const output = `
    <h3>Dear ${req.body.recipient}</h3>
    <br></br>

    Your friend ${req.body.sender} from ${req.body.groupname} is rally for his games. Join your friend and vote for the games you want to play.
    <br></br>
    From ${req.body.sender}: 
    <br></br>
    " ${req.body.text} "
    <br></br>
    Group: ${req.body.groupname}
    <br></br>
    <h3>JOLLY-COOP</h3>

    <img src="https://ik.imagekit.io/rt5o187rd/Screen_Shot_2023-03-15_at_11.29.41_AM.png?updatedAt=1678905231913">
    `
    const transporter = nodemailer.createTransport({
        host:"smtp.office365.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASS
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    
    const options = {
        from:"saveyourseat@outlook.com",
        to:req.body.email,
        subject:"Rally from Jolly",
        html:output
    };
    transporter.sendMail(options,  function(err,info){
        if(err){
            console.log(err);
            return
        }
        console.log(info.response)
        res.json({msg:"Email has been sent.Please check your email."})
        })
})

module.exports = router;
