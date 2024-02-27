const express = require('express');
const router = express.Router();
const db = require('../../databases/config/mysql');
const bcrypt = require('bcryptjs');
const {encodeJwt} = require('../../utils/jwt');
const {authAdmin} = require('../../middleware/auth');
const dotenv = require('dotenv');


dotenv.config();
router.use('/admin_menu', require('./admin_menu'));
router.use('/user_menu', require('./user_menu'));
router.use('/ipo', require('./ipo'));

// Promise를 반환하는 query 함수를 사용하여 쿼리 실행(동기실행)
function queryAsync(sql, values) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

router.get('/auth', authAdmin, (req, res, next) => {

  const user = req.user;

  return res.json({

    userData:{
    
      accessToken : req.accessToken,
      id: user.id,
      email: user.email,
      name: user.name,
      admin_yn: user.admin_yn
    }

  })


})

// 관리자 로그인 관련 로직
router.post('/login', (req, res, next) => {

  let userInfo = req.body;

  if(!userInfo.email || !userInfo.password){
    return res.json({
      loginSuccess: false,
      message: "필수 입력값이 누락되었습니다."
    })
  }

  //이메일 유효성 검사
  let patternEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  if(!patternEmail.test(userInfo.email)){
    return res.json({
      loginSuccess: false,
      message: "이메일 형식이 아닙니다."
    })
  }

  let selectId = 
  `
    SELECT *
    FROM users
    WHERE email = ?
  `;

  db.query(selectId, [userInfo.email], async(err, user) => {

    if(err){
      return next(err);
    }

    if(!user[0]){
      return res.json({
        loginSuccess: false,
        message: "아이디가 존재하지 않습니다."
      })
    }
    
    const isMatch = await bcrypt.compare(userInfo.password, user[0].password);

    if(!isMatch){
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 일치하지 않습니다."
      })
    }

    if(user[0].admin_yn === 'N'){
      return res.json({
        loginSuccess: false,
        message: "관리자 페이지 접근 권한이 없습니다."
      })
    }


    const accessToken = await encodeJwt(user[0].id, '1h');

    return res.json({

      loginSuccess: true,
      message: "로그인 성공하였습니다.",
      userData:{
        accessToken,
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        admin_yn: user[0].admin_yn
      }
    })

  })


})

//관리자 로그아웃 관련 로직
router.post('/logout', authAdmin, (req, res, next) => {

  try{

    console.log(req.user);

    return res.sendStatus(200);

  }catch(error){
    return next(error);
  }
  
})


module.exports = router;