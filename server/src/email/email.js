const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { authMail } = require('./templates/mail_template');
dotenv.config();

const smtpTransport = nodemailer.createTransport({

  pool: true,
  maxConnection: 1,
  service: 'naver',
  host: 'smtp.naver.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }


})

const emailSend = async(req, res) => {

  console.log('실행이메일')

  const mailOptions = {
    from : 'imjjun0117@naver.com',
    to: 'imjjun0117@naver.com',
    subject : '공모아에서 인증번호 발신입니다.',
    html : authMail
  }

  smtpTransport.sendMail(mailOptions, (err, response) => {

    console.log(response);

    if(err){

      // res.json({success: false, msg: '메일 전송 중 오류가 발생했습니다.'});
      smtpTransport.close();
      
    }else{
      
      // res.json({success: true, msg: '메일 전송에 성공하였습니다.'});
      smtpTransport.close();

    }


  })


}

module.exports = {emailSend}