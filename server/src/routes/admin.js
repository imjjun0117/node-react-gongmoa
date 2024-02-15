const express = require('express');
const router = express.Router();
const db = require('../databases/config/mysql');
const {enc}  = require('../middleware/bcrypt');
const bcrypt = require('bcryptjs');
const {encodeJwt, encPwd, decodeJwt} = require('../utils/jwt');
const {authAdmin} = require('../middleware/auth');
const dotenv = require('dotenv');
const { generateRandomCode, emailSend } = require('../email/email');
const { authMail, findPassword } = require('../email/templates/mail_template');

dotenv.config();

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

router.get('/menu', async (req, res, next) => {

  let rtnMenu =  [];

  const selectOneDepth = `
    SELECT 
      menu_code,
      name,
      path,
      element
    FROM
      admin_menu
    WHERE
      use_yn='Y'
      AND LENGTH(menu_code) = 3
    ORDER BY
      sort_num  
  `;

  try {
    const oneDepth = await queryAsync(selectOneDepth);

    for (const menu of oneDepth) {
      const selectTwoDepth = `
        SELECT 
          menu_code,
          name,
          path,
          element
        FROM
          admin_menu
        WHERE 
          use_yn = 'Y'
          AND SUBSTRING(menu_code, 1, 3) = ?
          AND LENGTH(menu_code) = 6
        ORDER BY
          sort_num
      `;

      const twoDepth = await queryAsync(selectTwoDepth, [menu.menu_code]);

      let oneDepthJson = {
        title: menu.name,
        layout: 'aoslwj7110',
        pages: twoDepth.map(menu2 => ({
          name: menu2.name,
          path: menu2.path,
          element: menu2.element
        }))
      };

      rtnMenu.push(oneDepthJson);
    }

    res.json({ rtnMenu });
  } catch (err) {
    next(err);
  }
});

// Promise를 반환하는 query 함수를 사용하여 쿼리 실행
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



// //회원수정관련 로직
// router.post('/updateUser', auth, async (req, res, next) => {

//   let userInfo = {...req.body};

//   if(!userInfo.email || !userInfo.name){
//     return res.json({
//       success: false,
//       message: "필수 입력값이 누락되었습니다."
//     })
//   }

//   let data = [userInfo.email, userInfo.name];
//   let targetUpdate = '';
  
//   //이메일 유효성 검사
//   let patternEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

//   if(!patternEmail.test(userInfo.email)){
//     return res.json({
//       success: false,
//       message: "이메일 형식이 아닙니다."
//     })
//   }

//   //이메일이 변경된 경우 본인인증 여부 확인
//   if(req.user.email !== userInfo.email){

//     let selectCode = 
//     `
//       SELECT *
//       FROM email_code
//       WHERE
//             email=?
//         AND code=?
//     `

//     db.query(selectCode, [userInfo.email, userInfo.code], (err2, result) => {

//       if(err2){
//         return next(err2);
//       }

//       if(!result[0]){
//         return res.json({
//           success: false,
//           message: "인증번호가 틀렸습니다."
//         })
//       }
      
//       if(result[0].is_checked !== 'Y'){
//         return res.json({
//           success: false,
//           message: "이메일 인증을 진행해주세요."
//         })
//       }

//       let deleteCode = 
//       `
//         DELETE 
//         FROM
//           email_code
//         WHERE 
//           email = ?
//       `

//       db.query(deleteCode, [userInfo.email], (err3, result) => {

//         if(err3){
//           return next(err3);
//         }

//       })

//     })

//   }

//   //닉네임 유효성 검사
//   let patternName =  /^[^\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

//   if(!patternName.test(userInfo.name) || userInfo.name.length > 10){
//     return res.json({
//       success: false,
//       message: "유효하지 않은 닉네임 형식입니다."
//     })
//   }

//   //비밀번호를 변경한다면
//   if(userInfo.password){
//     //비밀번호 유효성 검사
//     let patternPassword =  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;
  
//     if(!patternPassword.test(userInfo.password)){
//       return res.json({
//         success: false,
//         message: "비밀번호는 영문, 숫자, 특수문자 포함 8 ~ 16자로 입력해주세요."
//       })
//     }

//     targetUpdate += 'password=?,';
//     data.push(await encPwd(userInfo.password));

//   }

  
//   if(userInfo.email_yn){
    
//     data.push('Y');
    
//   }else{

//     data.push('N');

//   }
  
//   data.push(req.user.id);

//   let selectUser =
//   `
//     SELECT * 
//     FROM users
//     WHERE id=?
//   `

//   db.query(selectUser, [req.user.id], (err, user) => {

//     if(err){
//       return next(err);
//     }

//     if(!user[0]){
//       return res.json({
//         success: false,
//         message: "계정 조회 중 오류가 발생했습니다.\n잠시후 다시 시도해주세요."
//       })
//     }//end if
    

//     let updateUser = 
//     `
//       UPDATE users
//       SET 
//         email=?,
//         name=?,
//         update_dt=NOW(),
//         ${targetUpdate}
//         email_yn=?
//       WHERE 
//         id=?
//     `

//     db.query(updateUser, data, (err3, result) => {

//       if(err3){
//         return next(err3);
//       }

//       return res.status(200).json({
//         success: true,
//         message: "회원정보 수정을 완료했습니다."
//       })

//     })

//     })

//   })


//   router.post(`/updateKakao`, auth, (req, res, next) => {

//     let userInfo = {...req.body};
    
//     let selectUser = 
//     `
//       SELECT * 
//       FROM sns_users
//       WHERE id = ?
//     `;

//     db.query(selectUser, [req.user.id], (err, user) => {

//       if(err){
//         return next(err);
//       }

//       let data = [];

//       if(!user[0]){
//         return res.json({
//           success: false,
//           message: "해당 유저는 존재하지 않습니다." 
//         })
//       }

//       if(userInfo.email_yn){
    
//         data.push('Y');
        
//       }else{
//         data.push('N');
//       }

//       data.push(req.user.id);

//       let updateUser = 
//       `
//         UPDATE sns_users
//         SET 
//           email_yn=?,
//           update_dt=NOW()
//         WHERE
//           id=?
//       `;


//       db.query(updateUser, data, (err2, result) => {

//         if(err2){
//           return next(err2);
//         }

//         return res.status(200).json({
//           success: true,
//           message: "회원정보 수정을 완료했습니다."
//         })

//       })

//     })

//   })

//   router.post('/delete', auth, (req, res, next) => {

//     let id = req.user.id;
    

//     let deleteUser = 
//     `
//       UPDATE
//         users
//       SET
//         email = NULL,
//         name = NULL,
//         password = NULL,
//         del_yn = 'Y',
//         del_dt = NOW()
//       WHERE 
//         id = ?
//     `
//     if(id.toString().indexOf('kakao_') !== -1){

//       deleteUser = 
//       `
//         UPDATE
//           sns_users
//         SET
//           id = NULL,
//           email = NULL,
//           name = NULL,
//           del_yn = 'Y',
//           del_dt = NOW()
//         WHERE
//           id = ?
//       `

//     }

//     db.query(deleteUser, [id.toString()], (err, result) => {

//       if(err){
//         return next(err);
//       }

//       let deleteBookmark = 
//       `
//         DELETE 
//         FROM 
//           bookmark
//         WHERE
//           user_id=?
//       `;

      
//       db.query(deleteBookmark, [id.toString()], (err2, result2) => {

//         if(err2){
//           console.error('Delete Bookmark Query Error:', err2);
//           return next(err2)
//         }

//         return res.json({
//           success: true,
//           message: '회원탈퇴가 완료되었습니다.'
//         })

//       })


//     })


//   })


//   router.post('/readNotify', auth, (req, res, next) => {

//     if(!req.body || !req.user.id){
//       return res.json({
//         success: false,
//         message: '필수 입력값이 누락되었습니다.'
//       })
//     }//end if

//     let selectNotifyUsers =
//     `
//       SELECT *
//       FROM notify_users
//       WHERE 
//         notify_id = ?
//         AND
//         user_id = ?
//     `

//     db.query(selectNotifyUsers, [req.body.id, req.user.id.toString()], (err, notify) => {

//       if(err){
//         return next(err);
//       }

//       if(!notify[0]){
//         return res.json({
//           success: false,
//           message : '잘못된 접근입니다.'
//         })
//       }

//       if(notify[0].read_yn === 'N'){

//         let updateNotify =
//         `
//           UPDATE notify_users
//           SET 
//             read_yn = 'Y',
//             read_dt = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
//           WHERE 
//             notify_id = ?
//             AND 
//             user_id = ?
//         `
    
//         db.query(updateNotify, [req.body.id, req.user.id.toString()], (err2, result) => {
    
//           if(err2){
//             return next(err2);
//           }
    
//           return res.json({
//             success: true,
//             message: '읽음처리 성공'
//           })
    
//         })

//       }else{
//         return res.json({
//           success: true,
//           message: '이미 읽음'
//         })
//       }

//     })



//   })


//   //이메일 본인인증
//   router.post(`/sendCode`, (req, res, next) => {

//     let body = req.body;

//     if(!body.email){
//       return res.json({
//         success: false,
//         message: '이메일을 입력해주세요'
//       })
//     }

//     //이메일 유효성 검사
//     let patternEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

//     if(!patternEmail.test(body.email)){
//       return res.json({
//         success: false,
//         message: "이메일 형식이 아닙니다."
//       })
//     }

//     let selectUser =
//       `
//         SELECT * 
//         FROM users
//         WHERE email=?
//       `


//     db.query(selectUser, [body.email], (err, user) => {

//       if(err){
//         return next(err);
//       }

//       if(user[0]){
//         return res.json({
//           success: false,
//           message: "해당 이메일로 가입된 정보가 존재합니다."
//         })
//       }//end if

//       //인증코드 생성
//       let code = generateRandomCode();
    
//       let setCode = 
//       `
//         INSERT INTO 
//         email_code
//         (
//           email,
//           code,
//           reg_dt,
//           expired_dt
//         )
//         VALUES
//         (
//           ?,
//           ?,
//           DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'),
//           DATE_FORMAT(NOW() + INTERVAL 5 MINUTE, '%Y-%m-%d %H:%i:%s')
//         )
      
//       `
  
//       db.query(setCode, [body.email, code], (err2) => {
  
//         if(err2){
//           return next(err2);
//         }//end if
        
//         //이메일 템플릿 생성
//         let html = authMail.replaceAll('%%%@@%%%', code);
    
//         body.html = html;
//         body.subject = '공모아에서 인증번호 발신입니다.'
        
//         emailSend(req, res);
  
//       })
//     })


//   })
  
  
//   //이메일 코드 확인
//   router.post(`/codeChk`, (req, res, next) => {
    
//     let body = req.body;
    

//     let selectCode = 
//     `
//       SELECT
//         email,
//         code,
//         reg_dt
//       FROM email_code
//       WHERE 
//             email = ? 
//         AND code = ?
//         AND is_checked='N'
//     `
//     db.query(selectCode, [body.email, body.code], (err, result) => {

//       if(err){
//         return next(err);
//       }

//       if(result.length !== 1){
//         return res.json({
//           success: false,
//           message: '인증번호가 일치하지 않습니다.\n다시 시도해주세요.'
//         })
//       }
//       if(new Date(result[0].expired_dt) < new Date()){
//         return res.json({
//           success: false,
//           message: '인증시간이 만료되었습니다.'
//         })
        
//       }

//       db.query(`UPDATE email_code SET is_checked='Y' WHERE email = ? AND code = ?`, [body.email, body.code], (err2)=> {
        
//         if(err2){
//           return next(err2);
//         }

//         return res.json({
//           success: true,
//           message: '인증번호 확인이 되었습니다.'
//         })

//       })

//     })

//   })


//   //회원 비밀번호 찾기 로직
//   router.post(`/findPwd`, (req, res, next) => {

//     let body = req.body;

//     if(!body.email){
//       return res.json({
//         success: false,
//         message:'이메일을 입력해주세요'
//       })
//     }

//      //이메일 유효성 검사
//     let patternEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

//     if(!patternEmail.test(body.email)){
//       return res.json({
//         success: false,
//         message: "이메일 형식이 아닙니다."
//       })
//     }

//     let selectUser = 
//     `
//       SELECT *
//       FROM users
//       WHERE email=?
//     `

//     db.query(selectUser, [body.email], async(err, result) => {

//       if(err){
//         return next(err);
//       }

//       if(!result[0]){
//         return res.json({
//           success: false,
//           message: '해당 이메일은 가입된 이력이 없습니다.'
//         })
//       }

//       req.body.subject = '공모아에서 비밀번호 찾기 요청 결과 발신입니다.';

//       const accessToken = await encodeJwt(body.email, '1h');
//       req.body.html = findPassword.replaceAll('%%email%%', body.email).replaceAll('%%token%%', accessToken);

//       emailSend(req, res);

//     })

//   })


//   router.post('/updatePwd', async(req, res, next) => {

//     let body = req.body;

//     if(!body.email || !body.token){
//       return res.json({
//         success: false,
//         message: '잘못된 접근입니다. 다시 시도해주세요'
//       })
//     }

//     if(!body.password){
//       return res.json({
//         success: false,
//         message: '비밀번호가 누락되었습니다.'
//       })
//     }
    
//     const decoded = await decodeJwt(body.token);
//     const encoded = await encPwd(body.password);

//     if(!decoded._id || decoded._id !== body.email){
//       return res.json({
//         success: false,
//         message: '잘못된 토큰입니다.\n다시 시도해주세요.'
//       })
//     }


//     let selectUser = 
//     `
//       SELECT *
//       FROM users
//       WHERE email = ?
//     `

//     db.query(selectUser, [body.email], (err, user) => {

//       if(err){
//         return next(err)
//       }

//       if(!user[0]){
//         return res.json({
//           success: false,
//           message: '해당 이메일로 가입된 정보가 없습니다.'
//         })
//       }

//       let updateUser = 
//       `
//         UPDATE
//           users
//         SET
//           password=?
//         WHERE
//           id=?
//       `
      

//       db.query(updateUser, [encoded, user[0].id], (err2, result) => {

//         if(err2){
//           return next(err2);
//         }

//         return res.json({
//           success: true,
//           message: '비밀번호가 변경되었습니다. 로그인을 시도해주세요.'
//         })

//       })

//     })



//   })

module.exports = router;