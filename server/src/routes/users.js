const express = require('express');
const router = express.Router();
const db = require('../databases/config/mysql');
const {enc}  = require('../middleware/bcrypt');
const bcrypt = require('bcryptjs');
const {encodeJwt} = require('../utils/jwt');
const auth = require('../middleware/auth');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

router.get('/auth', auth, (req, res, next) => {

  const user = req.user;
  
  return res.json({

    userData:{
    
      accessToken : req.accessToken,
      id: user.id,
      email: user.email,
      name: user.name,
      htel: user.htel,
      bookmark: user.bookmark
    
    }

  })


})

//회원가입관련 로직
router.post('/register', enc, (req, res, next) => {

  let userInfo = {...req.body};

  if(!userInfo.email || !userInfo.name || !userInfo.password || !userInfo.htel){
    return res.json({
      success: false,
      message: "필수 입력값이 누락되었습니다."
    })
  }

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

//로그인관련 로직
router.post('/login', (req, res, next) => {

  let userInfo = req.body;

  if(!userInfo.email || !userInfo.password){
    return res.json({
      loginSuccess: false,
      message: "필수 입력값이 누락되었습니다."
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

      loginSuccess: true,
      message: "로그인 성공하였습니다.",
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

//회원 로그아웃 관련 로직
router.post('/logout', auth, (req, res, next) => {

  try{

    //카카오 계정일 경우
    // if(req.user.id.toString().indexOf('kakao_') !== -1){
    //   let kakaoToken = req.headers.kakaoauthorization;
    //   console.log(kakaoToken);
    //   if(kakaoToken){
    //     kakaoToken = kakaoToken.replaceAll('Gongmoa_','');
    //     axios.post('https://kapi.kakao.com/v1/user/logout', {}, {Authorization: `Bearer ${kakaoToken}`,
    //     }).then(res => {
    //       console.log('dsa;lkd;lsa');
    //     })

    //   }
    // }

    return res.sendStatus(200);
  }catch(error){
    return next(error);
  }
  
})

router.post('/bookmark', auth, (req, res, next) => {

  let body = req.body;
  let user = req.user;

  if(!user.id || !body.id){
    return res.json({
      success: false,
      message: '필수값이 누락되었습니다.'
    })
  }

  let data = [
    user.id.toString(),
    body.id
  ];

  let selectBookMark = 
  `
    SELECT *
    FROM bookmark
    WHERE 
    user_id = ?
    AND ipo_id = ?
  `;

  let deleteBookMark = 
  `
    DELETE 
    FROM bookmark
    WHERE 
    user_id = ?
    AND ipo_id = ?
  `;

  let insertBookMark = 
  `
    INSERT 
    INTO bookmark
    (
      user_id,
      ipo_id
    )
    VALUES
    (
      ?,
      ?
    )
  `;

  db.query(selectBookMark, data, (err, bookmark) => {

    if(err){
      return next(err);
    }//end if

    if(bookmark[0]){
      //북마크가 존재한다면 삭제
      db.query(deleteBookMark, data, (err2, result) => {
        if(err2){
          return next(err2);
        }

        return res.json({
          addFlag: 'N',
          id: body.id,
          success: true,
          message: '즐겨찾기에서 삭제하였습니다'
        })

      })
    }else{

      db.query(insertBookMark, data, (err2, result) => {

        if(err2){
          return next(err2);
        }

        return res.json({
          addFlag: 'Y',
          id: body.id,
          success: true,
          message: '즐겨찾기에 추가하였습니다'
        })

      })

    }

  })

})


router.get('/bookmark', auth, (req, res, next) => {

  let selectBookMark = 
  `
    SELECT ipo_id
    FROM bookmark
    WHERE user_id = ?
  `;

  db.query(selectBookMark, [req.user.id], (err, bookmark) => {

    if(err){
      return next(err);
    }

    const list = bookmark.map(item => item.ipo_id);
    
    res.json({
      bookmark: list
    });

  })

})

router.post(`/kakao/login`, (req, res, next) => {

  const userData = req.body.userData;

  const selectSnsUser = 
  `
    SELECT * 
    FROM sns_users
    WHERE id = ?
    AND del_yn = 'N'
  `;

  db.query(selectSnsUser, [`kakao_${userData.id}`], async(err, user) => {

    if(err){
      return next(err);
    }

    if(user[0]){//사용자 정보가 있을 경우 로그인처리
      
      let accessToken = await encodeJwt(`kakao_${userData.id}`);

      return res.json({
        kakaoLoginSuccess : true,
        userData:{
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          htel: user[0].htel,
          accessToken
        },
      })
    }//end if

    const insertSnsUser = 
    `
      INSERT INTO 
        sns_users
        (
          id,
          name,
          email,
          reg_dt,
          del_yn
        )
      VALUES
        (
          ?,
          ?,
          ?,
          NOW(),
          'N'
        )
    `;

    db.query(insertSnsUser, [`kakao_${userData.id}`, userData.properties.nickname, userData.kakao_account.email], async(err2, result) => {
      
      if(err2){
        return next(err2);
      }

      accessToken = await encodeJwt(`kakao_${userData.id}`);
      
      return res.json({
        kakaoLoginSuccess : true,
        newUser : true,
        userData:{
          id: userData.id,
          name: userData.properties.nickname,
          email: userData.kakao_account.email,
          htel: '',
          accessToken
        },
      })

    })

  })
  

})


router.post('/kakao/addTel', auth, (req, res, next) => {


  let body = req.body;

  if(!body.htel){
    return res.json({
      success: false,
      message: '필수 입력값이 누락되었습니다.'
    })
  }


  let selectSnsUser = 
  `
    UPDATE sns_users
    SET htel = ?
    WHERE id = ?  
  `

  db.query(selectSnsUser, [body.htel, req.user.id], (err, result) => {

    if(err){
      return next(err);
    }

    return res.json({
      success: true,
      message: '전화번호가 등록되었습니다.'
    })

  })
  


})


router.post(`/checkPwd`, auth, async (req, res, next) => {

  let body = req.body;

  if(!body.password){
    return res.json({
      success: false,
      message: '비밀번호를 입력해주세요.'
    })
  }//end if

  let selectUser = 
  `
    SELECT * 
    FROM users
    WHERE id = ?
  `;


  db.query(selectUser, [req.user.id], async (err, user) => {

    
    if(err) return next(err);

    if(!user[0]){
      return res.json({
        success: false,
        message: '회원정보가 존재하지 않습니다.'
      })
    }

    const isMatch = await bcrypt.compare(body.password, user[0].password);
    
    if(!isMatch){
      return res.json({
        success: false,
        message: "비밀번호가 일치하지 않습니다."
      })
    }

    return res.json({
      success: true,
      message: "비밀번호 확인이 되었습니다."
    })


  })

})


//회원가입관련 로직
router.post('/register', enc, (req, res, next) => {

  let userInfo = {...req.body};

  if(!userInfo.email || !userInfo.name || !userInfo.password || !userInfo.htel){
    return res.json({
      success: false,
      message: "필수 입력값이 누락되었습니다."
    })
  }

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

module.exports = router;