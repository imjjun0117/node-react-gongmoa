const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const db = require('../databases/config/mysql');
const { notifyHtml } = require('./templates/mail_template');
dotenv.config();

//이메일 환경설정
const smtpTransport = nodemailer.createTransport({

  pool: true,
  maxConnections: 20000,
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

//이메일 전송 로직
const emailNotify = async(body) => {

  const to = body.email;
  const subject = body.subject;
  const html = body.html;
  const data = body.data;

  const mailOptions = {
    from : process.env.SMTP_EMAIL,
    to: to,
    subject : subject,
    html : html
  }

  smtpTransport.sendMail(mailOptions, (err) => {

    if(err){

      console.log(err)
      
    }
    
    smtpTransport.close();


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

//오늘의 공모주 이메일 전송
const sendNotify = () => {

  let selectUser = 
  `
    SELECT user_id
    FROM 
      bookmark
    WHERE
      ipo_id IN 
      (
        SELECT ipo_id
        FROM
          notify
        WHERE
          DATE_FORMAT(send_dt, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d')
      )
    GROUP BY
        user_id
  `

  db.query(selectUser, (err, users) => {

    if(err){
      console.error(err);
    }

    users.map(user => {

      let selectCnt = 
      `
        SELECT
          COUNT(*) AS cnt,
          n.type
        FROM 
          notify n
        INNER JOIN
          notify_users nu ON n.id = nu.notify_id
        WHERE 
          nu.user_id = ?
        GROUP BY
          n.type
      `

      
      db.query(selectCnt, [user.user_id], (err2, data_group) => {
        
        if(err2){
          console.error(err2);
        }
        
        let html = notifyHtml;
        
        data_group.map(data => {

          html = html.replaceAll(`%%@@${data.type}_CNT%%@@`, data.cnt)
          
          let selectNotify = 
          `
            SELECT
              n.corp_nm,
              n.url
            FROM 
              notify n
            INNER JOIN
              notify_users nu ON n.id = nu.notify_id
            WHERE 
              n.type=?
              AND nu.user_id=?
          `
          db.query(selectNotify, [data.type, user.user_id], (err3, notifies) => {

            if(err3){
              console.err(err3);
              return false;
            }

            let corp_info = ``;

            notifies.map(notify => {

              corp_info +=
              `
                <div style="padding:3px 0 5px 60px;line-height:20px;font-size:15px;"> - <a style="text-decoration:none;color:#333;cursor:pointer;" href="${process.env.CLIENT_URI}${notify.url}">${notify.corp_nm}</a></div>
              `

            })

            html = html.replaceAll(`%%@@${data.type}_INFO%%@@`, corp_info);

          })

        })
  
  
        let selectEmail =
        `
          SELECT 
            email,
            name
          FROM users
          WHERE id=?
    
        `
        if(user.user_id.toString().indexOf('kakao_') !== -1){
          selectEmail = 
          `
            SELECT 
              email,
              name
            FROM sns_users
            WHERE id = ?
          
          `
        }
  
        db.query(selectEmail, [user.user_id], (err3, email) => {

          
          if(err3){
            console.error(err3);
          }

          html = html.replaceAll(`%%@@ST_SUB_INFO%%@@`, '')
          html = html.replaceAll(`%%@@END_SUB_INFO%%@@`, '')
          html = html.replaceAll(`%%@@ST_FORECAST_INFO%%@@`, '')
          html = html.replaceAll(`%%@@END_FORECAST_INFO%%@@`, '')

          html = html.replaceAll(`%%@@ST_SUB_CNT%%@@`, '0')
          html = html.replaceAll(`%%@@END_SUB_CNT%%@@`, '0')
          html = html.replaceAll(`%%@@ST_FORECAST_CNT%%@@`, '0')
          html = html.replaceAll(`%%@@END_FORECAST_CNT%%@@`, '0')
    
          let body = {
            email : email[0].email,
            subject : `[공모아] ${email[0].name}님 오늘의 공모주 일정 확인하세요!`,
            html : html,
    
          }
    
    
          emailNotify(body);
          // return false;
        })

      })




    })

  })


}


module.exports = {emailSend, generateRandomCode, cleanEmailCode, sendNotify}