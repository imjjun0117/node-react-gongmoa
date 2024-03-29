const express = require('express');
const router = express.Router();
const db = require('../../databases/config/mysql');
const {enc}  = require('../../middleware/bcrypt');
const bcrypt = require('bcryptjs');
const {encodeJwt, encPwd, decodeJwt} = require('../../utils/jwt');
const {auth} = require('../../middleware/auth');
const dotenv = require('dotenv');
const { generateRandomCode, emailSend } = require('../../email/email');
const { authMail, findPassword } = require('../../email/templates/mail_template');

dotenv.config();

router.get('/auth', auth, (req, res, next) => {
  /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 로그인 권한 확인관련 미들웨어'
    */

  const user = req.user;
  
  return res.json({

    userData:{
    
      accessToken : req.accessToken,
      id: user.id,
      email: user.email,
      name: user.name,
      htel: user.htel,
      bookmark: user.bookmark,
      email_yn : user.email_yn,
      notify: user.notify,
      notify_cnt : user.notify_cnt
    }

  })


})

router.post('/register', enc, (req, res, next) => {
   /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 가입관련 로직'
    * #swagger.description = '회원 가입 로직입니다.'
    */
  let userInfo = {...req.body};

  if(!userInfo.email || !userInfo.name || !userInfo.password || !userInfo.code || !userInfo.email_yn){
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

    let selectCode = 
    `
      SELECT *
      FROM email_code
      WHERE
            email=?
        AND code=?
    `

    db.query(selectCode, [userInfo.email, userInfo.code], (err2, result) => {

      if(err2){
        return next(err2);
      }

      if(!result[0]){
        return res.json({
          success: false,
          message: "인증번호가 틀렸습니다."
        })
      }
      
      if(result[0].is_checked !== 'Y'){
        return res.json({
          success: false,
          message: "이메일 인증을 진행해주세요."
        })
      }

      let deleteCode = 
      `
        DELETE 
        FROM
          email_code
        WHERE 
          email = ?
      `

      db.query(deleteCode, [userInfo.email], (err3, result) => {

        if(err3){
          return next(err3);
        }

        let selectMaxId = 
        `
          SELECT 
            IFNULL(MAX(id),0)+1 as id
          FROM users;
        `
    
        
        db.query(selectMaxId, (err4, id) => {
          
          if(err4){
            return next(err4);
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
                admin_yn,
                reg_dt,
                del_yn,
                email_yn
    
              )
            values
              (
                ?,
                ?,
                ?,
                ?,
                'N',
                NOW(),
                'N',
                ?
              )      
          `
    
          db.query(insertUser, [maxId, userInfo.email, userInfo.name, userInfo.password, userInfo.email_yn], (err5, result) => {
    
            if(err5){
              return next(err5);
            }
    
            return res.status(200).json({
              success: true,
              message: "회원가입을 완료했습니다."
            })
    
          })
    
        })
      })
    })
  })
})

//로그인관련 로직
router.post('/login', (req, res, next) => {
  /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 로그인관련 로직'
    */

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
      success: false,
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
        email_yn : user[0].email_yn
      },
      remember: userInfo.remember
    })

  })


})

//회원 로그아웃 관련 로직
router.post('/logout', auth, (req, res, next) => {

  /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 로그아웃관련 로직'
    */

  try{

    return res.sendStatus(200);

  }catch(error){
    return next(error);
  }
  
})

router.post('/bookmark', auth, (req, res, next) => {

  /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 즐겨찾기 등록관련 로직'
    */

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

  /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 즐겨찾기 불러오기관련 로직'
    */

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

   /**
    * #swagger.tags = ['사용자/Kakao']
    * #swagger.summary = '카카오 로그인관련 로직'
    */

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
      
      let accessToken = await encodeJwt(`kakao_${userData.id}`, '1h');

      return res.json({
        kakaoLoginSuccess : true,
        newUser: false,
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

      accessToken = await encodeJwt(`kakao_${userData.id}`, '1h');
      
      return res.json({
        kakaoLoginSuccess : true,
        newUser: true,
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


router.post('/kakao/addInfo', auth, (req, res, next) => {

  /**
    * #swagger.tags = ['사용자/Kakao']
    * #swagger.summary = '카카오 추가 정보등록 관련 로직'
    * #swagger.description = '카카오 회원관련하여 추가 정보를 등록합니다.(이메일 수신여부)'
    */

  let body = req.body;

  if(!body.email_yn){
    return res.json({
      success: false,
      message: '필수 입력값이 누락되었습니다.'
    })
  }


  let selectSnsUser = 
  `
    UPDATE sns_users
    SET email_yn = ?
    WHERE id = ?  
  `

  db.query(selectSnsUser, [body.email_yn, req.user.id], (err, result) => {

    if(err){
      return next(err);
    }

    return res.json({
      success: true,
      message: '수신 동의 여부가 등록되었습니다.'
    })

  })
  


})

//개인정보 수정 비밀번호 확인 로직
router.post(`/checkPwd`, auth, async (req, res, next) => {

  /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 정보 수정 비밀번호 확인 관련 로직'
    */

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

    /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원정보 수정관련 로직'
    */

  let userInfo = {...req.body};

  if(!userInfo.email || !userInfo.name){
    return res.json({
      success: false,
      message: "필수 입력값이 누락되었습니다."
    })
  }

  let data = [userInfo.email, userInfo.name];
  let targetUpdate = '';
  
  //이메일 유효성 검사
  let patternEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  if(!patternEmail.test(userInfo.email)){
    return res.json({
      success: false,
      message: "이메일 형식이 아닙니다."
    })
  }

  //이메일이 변경된 경우 본인인증 여부 확인
  if(req.user.email !== userInfo.email){

    let selectCode = 
    `
      SELECT *
      FROM email_code
      WHERE
            email=?
        AND code=?
    `

    db.query(selectCode, [userInfo.email, userInfo.code], (err2, result) => {

      if(err2){
        return next(err2);
      }

      if(!result[0]){
        return res.json({
          success: false,
          message: "인증번호가 틀렸습니다."
        })
      }
      
      if(result[0].is_checked !== 'Y'){
        return res.json({
          success: false,
          message: "이메일 인증을 진행해주세요."
        })
      }

      let deleteCode = 
      `
        DELETE 
        FROM
          email_code
        WHERE 
          email = ?
      `

      db.query(deleteCode, [userInfo.email], (err3, result) => {

        if(err3){
          return next(err3);
        }

      })

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

  
  if(userInfo.email_yn){
    
    data.push('Y');
    
  }else{

    data.push('N');

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
        update_dt=NOW(),
        ${targetUpdate}
        email_yn=?
      WHERE 
        id=?
    `

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

    /**
    * #swagger.tags = ['사용자/Kakao']
    * #swagger.summary = '소셜회원 정보수정 관련 로직'
    */

    let userInfo = {...req.body};
    
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

      let data = [];

      if(!user[0]){
        return res.json({
          success: false,
          message: "해당 유저는 존재하지 않습니다." 
        })
      }

      if(userInfo.email_yn){
    
        data.push('Y');
        
      }else{
        data.push('N');
      }

      data.push(req.user.id);

      let updateUser = 
      `
        UPDATE sns_users
        SET 
          email_yn=?,
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

  router.post('/delete', auth, (req, res, next) => {
    /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원탈퇴 로직'
    */
    let id = req.user.id;
    

    let deleteUser = 
    `
      UPDATE
        users
      SET
        email = NULL,
        name = NULL,
        password = NULL,
        del_yn = 'Y',
        del_dt = NOW()
      WHERE 
        id = ?
    `
    if(id.toString().indexOf('kakao_') !== -1){

      deleteUser = 
      `
        UPDATE
          sns_users
        SET
          id = NULL,
          email = NULL,
          name = NULL,
          del_yn = 'Y',
          del_dt = NOW()
        WHERE
          id = ?
      `

    }

    db.query(deleteUser, [id.toString()], (err, result) => {

      if(err){
        return next(err);
      }

      let deleteBookmark = 
      `
        DELETE 
        FROM 
          bookmark
        WHERE
          user_id=?
      `;

      
      db.query(deleteBookmark, [id.toString()], (err2, result2) => {

        if(err2){
          console.error('Delete Bookmark Query Error:', err2);
          return next(err2)
        }

        return res.json({
          success: true,
          message: '회원탈퇴가 완료되었습니다.'
        })

      })


    })


  })


  router.post('/readNotify', auth, (req, res, next) => {

    /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 알림 읽음처리 관련 로직'
    */

    if(!req.body || !req.user.id){
      return res.json({
        success: false,
        message: '필수 입력값이 누락되었습니다.'
      })
    }//end if

    let selectNotifyUsers =
    `
      SELECT *
      FROM notify_users
      WHERE 
        notify_id = ?
        AND
        user_id = ?
    `

    db.query(selectNotifyUsers, [req.body.id, req.user.id.toString()], (err, notify) => {

      if(err){
        return next(err);
      }

      if(!notify[0]){
        return res.json({
          success: false,
          message : '잘못된 접근입니다.'
        })
      }

      if(notify[0].read_yn === 'N'){

        let updateNotify =
        `
          UPDATE notify_users
          SET 
            read_yn = 'Y',
            read_dt = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
          WHERE 
            notify_id = ?
            AND 
            user_id = ?
        `
    
        db.query(updateNotify, [req.body.id, req.user.id.toString()], (err2, result) => {
    
          if(err2){
            return next(err2);
          }
    
          return res.json({
            success: true,
            message: '읽음처리 성공'
          })
    
        })

      }else{
        return res.json({
          success: true,
          message: '이미 읽음'
        })
      }

    })



  })


  //이메일 본인인증
  router.post(`/sendCode`, (req, res, next) => {

    /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 이메일 인증코드 전송 관련 로직'
    */

    let body = req.body;

    if(!body.email){
      return res.json({
        success: false,
        message: '이메일을 입력해주세요'
      })
    }

    //이메일 유효성 검사
    let patternEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if(!patternEmail.test(body.email)){
      return res.json({
        success: false,
        message: "이메일 형식이 아닙니다."
      })
    }

    let selectUser =
      `
        SELECT * 
        FROM users
        WHERE email=?
      `

    try{


      db.query(selectUser, [body.email], (err, user) => {
  
        if(err){
          return next(err);
        }
  
        if(user[0]){
          return res.json({
            success: false,
            message: "해당 이메일로 가입된 정보가 존재합니다."
          })
        }//end if
  
        let deleteEmailCode = 
        `
          DELETE 
          FROM email_code
          WHERE 
            email=?
        `

        db.query(deleteEmailCode, [body.email], (err_delete_email) => {

          if(err_delete_email){
            return res.json({
              success: false,
              message: "서버에서 에러가 발생했습니다.\n잠시후 다시 시도해주세요."
            })
          }
          
          //인증코드 생성
          let code = generateRandomCode();
        
          let setCode = 
          `
            INSERT INTO 
            email_code
            (
              email,
              code,
              reg_dt,
              expired_dt
            )
            VALUES
            (
              ?,
              ?,
              DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'),
              DATE_FORMAT(NOW() + INTERVAL 5 MINUTE, '%Y-%m-%d %H:%i:%s')
            )
          
          `
          
          db.query(setCode, [body.email, code], async(err2) => {
      
            if(err2){
              return next(err2);
            }//end if
            
            //이메일 템플릿 생성
            let html = authMail.replaceAll('%%%@@%%%', code);
        
            body.html = html;
            body.subject = '공모아에서 인증번호 발신입니다.'
  
            await emailSend(req, res);
      
          })

        })

      })

    }catch(err){
      console.error('이메일 전송 시도중 에러가 발생했습니다.',err)
      return res.json({
        success: false,
        message: "서버에서 에러가 발생했습니다.\n잠시후 다시 시도해주세요."
      })
    }


  })
  
  
  //이메일 코드 확인
  router.post(`/codeChk`, (req, res, next) => {
    
    /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 이메일 인증코드 확인 관련 로직'
    */

    let body = req.body;
    

    let selectCode = 
    `
      SELECT
        email,
        code,
        reg_dt
      FROM email_code
      WHERE 
            email = ? 
        AND code = ?
        AND is_checked='N'
    `
    db.query(selectCode, [body.email, body.code], (err, result) => {

      if(err){
        return next(err);
      }

      if(result.length !== 1){
        return res.json({
          success: false,
          message: '인증번호가 일치하지 않습니다.\n다시 시도해주세요.'
        })
      }
      if(new Date(result[0].expired_dt) < new Date()){
        return res.json({
          success: false,
          message: '인증시간이 만료되었습니다.'
        })
        
      }

      db.query(`UPDATE email_code SET is_checked='Y' WHERE email = ? AND code = ?`, [body.email, body.code], (err2)=> {
        
        if(err2){
          return next(err2);
        }

        return res.json({
          success: true,
          message: '인증번호 확인이 되었습니다.'
        })

      })

    })

  })


  //회원 비밀번호 찾기 로직
  router.post(`/findPwd`, (req, res, next) => {

    /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 비밀번호 찾기 관련 로직'
    */

    let body = req.body;

    if(!body.email){
      return res.json({
        success: false,
        message:'이메일을 입력해주세요'
      })
    }

     //이메일 유효성 검사
    let patternEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if(!patternEmail.test(body.email)){
      return res.json({
        success: false,
        message: "이메일 형식이 아닙니다."
      })
    }

    let selectUser = 
    `
      SELECT *
      FROM users
      WHERE email=?
    `

    db.query(selectUser, [body.email], async(err, result) => {

      if(err){
        return next(err);
      }

      if(!result[0]){
        return res.json({
          success: false,
          message: '해당 이메일은 가입된 이력이 없습니다.'
        })
      }

      req.body.subject = '공모아에서 비밀번호 찾기 요청 결과 발신입니다.';

      const accessToken = await encodeJwt(body.email, '1h');
      req.body.html = findPassword.replaceAll('%%email%%', body.email).replaceAll('%%token%%', accessToken);

      emailSend(req, res);

    })

  })


  router.post('/updatePwd', async(req, res, next) => {

    /**
    * #swagger.tags = ['사용자/Users']
    * #swagger.summary = '회원 비밀번호 수정 관련 로직'
    */

    let body = req.body;

    if(!body.email || !body.token){
      return res.json({
        success: false,
        message: '잘못된 접근입니다. 다시 시도해주세요'
      })
    }

    if(!body.password){
      return res.json({
        success: false,
        message: '비밀번호가 누락되었습니다.'
      })
    }
    
    const decoded = await decodeJwt(body.token);
    const encoded = await encPwd(body.password);

    if(!decoded._id || decoded._id !== body.email){
      return res.json({
        success: false,
        message: '잘못된 토큰입니다.\n다시 시도해주세요.'
      })
    }


    let selectUser = 
    `
      SELECT *
      FROM users
      WHERE email = ?
    `

    db.query(selectUser, [body.email], (err, user) => {

      if(err){
        return next(err)
      }

      if(!user[0]){
        return res.json({
          success: false,
          message: '해당 이메일로 가입된 정보가 없습니다.'
        })
      }

      let updateUser = 
      `
        UPDATE
          users
        SET
          password=?,
          update_dt=NOW()
        WHERE
          id=?
      `
      

      db.query(updateUser, [encoded, user[0].id], (err2, result) => {

        if(err2){
          return next(err2);
        }

        return res.json({
          success: true,
          message: '비밀번호가 변경되었습니다. 로그인을 시도해주세요.'
        })

      })

    })



  })

module.exports = router;