const express = require('express');
const router = express.Router();
const db = require('../databases/config/mysql');
const {enc}  = require('../middleware/bcrypt');
const bcrypt = require('bcryptjs');
const {encodeJwt} = require('../utils/jwt');
const auth = require('../middleware/auth');

router.post('/register', enc, (req, res, next) => {

  let userInfo = {...req.body};

  let selectUser =
  `
    SELECT * 
    FROM users
    WHERE email=?
  `

  db.query(selectUser, [userInfo.email], (err, user) => {

    if(err){
      return next(err);
    }

    if(user[0]){
      return res.json({
        success: false,
        message: "해당 이메일로 가입된 정보가 존재합니다."
      })
    }//end if

    let selectMaxId = 
    `
      SELECT 
        IFNULL(MAX(id),0)+1 as id
      FROM users;
    `

    
    db.query(selectMaxId, (err2, id) => {
      
      if(err2){
        return next(err2);
      }
    
      
      let maxId = id[0].id;
    
      let insertUser = 
      `
        INSERT INTO
          users
          (
            id,
            email,
            name,
            password,
            htel,
            admin_yn,
            reg_dt,
            del_yn

          )
        values
          (
            ?,
            ?,
            ?,
            ?,
            ?,
            'N',
            NOW(),
            'N'
          )      
      `

      db.query(insertUser, [maxId, userInfo.email, userInfo.name, userInfo.password, userInfo.htel], (err3, result) => {

        if(err3){
          return next(err3);
        }

        return res.status(200).json({
          success: true,
          message: "회원가입을 완료했습니다."
        })

      })

    })



  })



})

router.post('/login', (req, res, next) => {


  let userInfo = req.body;

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
        message: "회원 아이디가 존재하지 않습니다."
      })
    }

    const isMatch = await bcrypt.compare(userInfo.password, user[0].password);

    if(!isMatch){
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 일치하지 않습니다."
      })
    }


    const accessToken = await encodeJwt(user[0].id);

    return res.json({
      result:{
        loginSuccess: true,
        message: "로그인 성공하였습니다."
      },
      userData:{
        accessToken,
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        htel: user[0].htel
      }
    })

  })


})


router.get('/auth', auth, (req, res, next) => {

  const user = req.user;
  
  return res.json({

    userData:{
    
      accessToken : req.accessToken,
      id: user.id,
      email: user.email,
      name: user.name,
      htel: user.htel
    
    }

  })


})

module.exports = router;