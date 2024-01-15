const express = require('express');
const router = express.Router();
const db = require('../databases/config/mysql');
const {enc}  = require('../middleware/bcrypt');
const bcrypt = require('bcryptjs');
const {encodeJwt, encPwd} = require('../utils/jwt');
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
      bookmark: user.bookmark,
      sms_yn : user.sms_yn,
      sms_time : user.sms_time
    
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
  

  //이메일 유효성 검사
  let patternEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  if(!patternEmail.test(userInfo.email)){
    return res.json({
      success: false,
      message: "이메일 형식이 아닙니다."
    })
  }

  //닉네임 유효성 검사
  let patternName =  /^[^\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

  if(!patternName.test(userInfo.name) || userInfo.name.length > 10){
    return res.json({
      success: false,
      message: "유효하지 않은 닉네임 형식입니다."
    })
  }

  //비밀번호 유효성 검사
  let patternPassword =  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;

  if(!patternPassword.test(userInfo.password)){
    return res.json({
      success: false,
      message: "비밀번호는 영문, 숫자, 특수문자 포함 8 ~ 16자로 입력해주세요."
    })
  }

  //핸드폰 유효성 검사
  let patternPhone =  /^(01[016789]{1})-[0-9]{3,4}-[0-9]{4}$/;

  if(!patternPhone.test(userInfo.htel)){
    return res.json({
      success: false,
      message: "핸드폰 번호가 유효하지 않습니다."
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

    let expiredIn = '1h';
    if(userInfo.remember){
      expiredIn = '30d';
    }

    const accessToken = await encodeJwt(user[0].id, expiredIn);

    return res.json({

      loginSuccess: true,
      message: "로그인 성공하였습니다.",
      userData:{
        accessToken,
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        htel: user[0].htel,
        sms_yn : user[0].sms_yn,
        sms_time : user[0].sms_time
      },
      remember: userInfo.remember
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


//회원수정관련 로직
router.post('/updateUser', auth, async (req, res, next) => {

  let userInfo = {...req.body};

  if(!userInfo.email || !userInfo.name || !userInfo.htel){
    return res.json({
      success: false,
      message: "필수 입력값이 누락되었습니다."
    })
  }

  let data = [userInfo.email, userInfo.name, userInfo.htel];
  let targetUpdate = '';
  
  //이메일 유효성 검사
  let patternEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  if(!patternEmail.test(userInfo.email)){
    return res.json({
      success: false,
      message: "이메일 형식이 아닙니다."
    })
  }

  //닉네임 유효성 검사
  let patternName =  /^[^\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

  if(!patternName.test(userInfo.name) || userInfo.name.length > 10){
    return res.json({
      success: false,
      message: "유효하지 않은 닉네임 형식입니다."
    })
  }

  //비밀번호를 변경한다면
  if(userInfo.password){
    //비밀번호 유효성 검사
    let patternPassword =  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
  
    if(!patternPassword.test(userInfo.password)){
      return res.json({
        success: false,
        message: "비밀번호는 영문, 숫자, 특수문자 포함 8 ~ 16자로 입력해주세요."
      })
    }

    targetUpdate += 'password=?,';
    data.push(await encPwd(userInfo.password));

  }

  //핸드폰 유효성 검사
  let patternPhone =  /^(01[016789]{1})-[0-9]{3,4}-[0-9]{4}$/;

  if(!patternPhone.test(userInfo.htel)){
    return res.json({
      success: false,
      message: "핸드폰 번호가 유효하지 않습니다."
    })
  }
  
  if(userInfo.sms_yn){
    
    data.push('Y');
    
    if(['30m','1h','2h'].indexOf(userInfo.sms_time) === -1){
      return res.json({
        success: false,
        message: "시간을 설정해주세요."
      })
    }
    
    data.push(userInfo.sms_time);
    
  }else{
    data.push('N');
    data.push('');
  }
  
  data.push(req.user.id);

  let selectUser =
  `
    SELECT * 
    FROM users
    WHERE id=?
  `

  db.query(selectUser, [req.user.id], (err, user) => {

    if(err){
      return next(err);
    }

    if(!user[0]){
      return res.json({
        success: false,
        message: "계정 조회 중 오류가 발생했습니다.\n잠시후 다시 시도해주세요."
      })
    }//end if
    

    let updateUser = 
    `
      UPDATE users
      SET 
        email=?,
        name=?,
        htel=?,
        update_dt=NOW(),
        ${targetUpdate}
        sms_yn=?,
        sms_time=?
      WHERE 
        id=?
    `

    console.log(updateUser, data);

    db.query(updateUser, data, (err3, result) => {

      if(err3){
        return next(err3);
      }

      return res.status(200).json({
        success: true,
        message: "회원정보 수정을 완료했습니다."
      })

    })

    })

  })


  router.post(`/updateKakao`, auth, (req, res, next) => {

    let userInfo = {...req.body};

    if(!userInfo.htel){
      return res.json({
        success: false,
        message: "핸드폰 번호를 입력해주세요."
      })
    }

    
    let selectUser = 
    `
      SELECT * 
      FROM sns_users
      WHERE id = ?
    `;

    db.query(selectUser, [req.user.id], (err, user) => {

      if(err){
        return next(err);
      }

      let data = [userInfo.htel];

      if(!user[0]){
        return res.json({
          success: false,
          message: "해당 유저는 존재하지 않습니다." 
        })
      }

      if(userInfo.sms_yn){
    
        data.push('Y');
        
        if(['30m','1h','2h'].indexOf(userInfo.sms_time) === -1){
          return res.json({
            success: false,
            message: "시간을 설정해주세요."
          })
        }
        
        data.push(userInfo.sms_time);
        
      }else{
        data.push('N');
        data.push('');
      }

      data.push(req.user.id);

      let updateUser = 
      `
        UPDATE sns_users
        SET 
          htel=?,
          sms_yn=?,
          sms_time=?,
          update_dt=NOW()
        WHERE
          id=?
      `;


      db.query(updateUser, data, (err2, result) => {

        if(err2){
          return next(err2);
        }

        return res.status(200).json({
          success: true,
          message: "회원정보 수정을 완료했습니다."
        })

      })

    })

  })


module.exports = router;