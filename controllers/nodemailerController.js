require("dotenv").config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { callbackPromise } = require('nodemailer/lib/shared');

router.post('/',(req,res)=>{
    const output = `
    Dear ${req.body.customer_name}

    You have a reservation with ${req.body.restaurant} on ${req.body.date} at ${req.body.time}. Party size is ${req.body.party_size}.
    
    We are looking forward to seeing you and your party group.
    
    ${req.body.restaurant}
    Save your seat.app
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
        //TODO:change into user email: req.body.email
        to:req.body.email,
        subject:"Reservation Info",
        text:output
    };
    transporter.sendMail(options,  function(err,info){
        if(err){
            console.log(err);
            return
        }
        console.log(info.response)
        res.render('userview2-2',{msg:"Email has been sent.Please check your email."})
        })
})

module.exports = router;
