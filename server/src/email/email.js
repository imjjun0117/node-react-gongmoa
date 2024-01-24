const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { authMail } = require('./templates/mail_template');
dotenv.config();

//이메일 환경설정
const smtpTransport = nodemailer.createTransport({

  // pool: true,
  // maxConnection: 1,
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

//이메일 전송 로직
const emailSend = async(req, res) => {

  const to = req.body.email;
  const subject = req.body.subject;
  const html = req.body.html;
  const data = req.body.data;

  const mailOptions = {
    from : process.env.SMTP_EMAIL,
    to: to,
    subject : subject,
    html : html
  }

  smtpTransport.sendMail(mailOptions, (err) => {

    if(err){

      res.json({success: false, msg: '메일 전송 중 오류가 발생했습니다.'});
      smtpTransport.close();
      
    }else{
  
      res.json({ success: true, msg: '메일 전송에 성공하였습니다.', data: data });
      smtpTransport.close();

    }


  })


}

//10자리 대문자+숫자 형식 난수 생성(이메일 인증)
const  generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}


const cleanEmailCode = () => {

  let deleteEmailCode = 
  `
    DELETE 
    FROM email_code
    WHERE 
      expired_dt < DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
  `

  db.query(deleteEmailCode, (err) => {
    if(err){
      console.error('email_code 테이블 정리 중 에러발생 : ',err);
    }

  })

}

module.exports = {emailSend, generateRandomCode, cleanEmailCode}