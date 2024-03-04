const express = require('express');
const router = express.Router();
const db = require('../../databases/config/mysql');
const dotenv = require('dotenv');
const { encPwd } = require('../../utils/jwt');


dotenv.config();

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

router.get('/', async (req, res, next) => {

  let query = req.query;

  if(!query.type || !query.user_type){
    return res.json({
      success: false,
      msg: '필수 입력값이 누락되었습니다.'
    })
  }

  let condition = `
    AND email = ?
  `
  if(query.type === 'name'){
    condition = 'AND name = ?'
  }

  let selectUser = 
  `
    SELECT 
      id,
      email,
      name,
      DATE_FORMAT(reg_dt, '%Y-%m-%d') AS reg_dt,
      DATE_FORMAT(update_dt, '%Y-%m-%d') AS update_dt,
      black_yn,
      admin_yn,
      '일반' AS type
    FROM
      users
    WHERE
      1=1
    ${condition}
  `

  if(query.user_type === 'SNS'){
    selectUser = 
    `
    SELECT 
      id,
      email,
      name,
      DATE_FORMAT(reg_dt, '%Y-%m-%d') AS reg_dt,
      DATE_FORMAT(update_dt, '%Y-%m-%d') AS update_dt,
      black_yn,
      'N' AS admin_yn,
      '카카오' AS type
    FROM
      sns_users
    WHERE
      1=1
      ${condition}
    `
  }


  try{

    const user = await queryAsync(selectUser, [query.keyword ? query.keyword.trim() : '']);

    return res.json({
      success: true,
      user_info: user
    })

  }catch(err){
    console.log(err)

    return res.json({
      success: false,
      msg: '서버에서 오류가 발생했습니다.\n잠시후 다시 시도해주세요.'
    })
  }


});

//회원 상태 변경
router.post('/setStatus', async (req, res, next) => {

  let body = req.body;
  
  let updateStatus = `
    UPDATE
      users
    SET
      ${body.type} = ?,
      update_dt = NOW()
    WHERE 
      id = ?
  
  `
  if(!body.value || !body.id || !body.type){
    return res.json({
      success: false,
      msg: '필수 입력값이 누락되었습니다.'
    })
  }

  if(body.type !== 'black_yn' && body.type !== 'admin_yn'){
    return res.json({
      success: false,
      msg: '잘못된 접근입니다.'
    })
  }

  if(body.id.toString().indexOf('kakao_') !== -1){

    updateStatus = `
      UPDATE
        sns_users
      SET
        black_yn = ?,
        update_dt = NOW()
      WHERE 
        id = ?
    `

    if(body.type === 'admin_yn'){
      return res.json({
        success: false,
        msg: '소셜회원은 관리자 등록이 불가능합니다.'
      })
    }

  }//end if

  try{

    await queryAsync(updateStatus, [body.value, body.id]);

    return res.json({
      success: true,
      msg: '상태변경을 성공하였습니다.'
    })

  }catch(err){

    console.error(err);
    return res.json({
      success: false,
      msg: '서버에서 에러가 발생했습니다.\잠시후 다시 시도해주세요.'
    })

  }

})

router.get('/getUserDetail', async (req, res, next) => {

  let query = req.query;
  let id = query.id;

  if(!id){
    return res.json({
      success: false,
      msg: '잘못된 접근입니다.'
    })
  }

  let selectUser = 
  `
    SELECT 
      name,
      email,
      DATE_FORMAT(reg_dt, '%Y-%m-%d') AS reg_dt,
      DATE_FORMAT(update_dt, '%Y-%m-%d') AS update_dt,
      black_yn,
      admin_yn,
      '일반' AS type
    FROM
      users
    WHERE
      id = ?
      AND
      del_yn = 'N'
  `
  
  if(id.toString().indexOf('kakao_') !== -1){

    return res.json({
      success: false,
      msg: '소셜회원은 비밀번호 수정이 불가능합니다.'
    })

  }

  const user = await queryAsync(selectUser, [id]);


  if(!user[0]){
    return res.json({
      success: false,
      msg: '해당 회원은 존재하지 않습니다.'
    })
  }

  return res.json({
    success: true,
    userDetail: user[0]
  })

})

router.post('/modifyPassword', async (req, res, next) => {
  
  let password = req.body.password;
  let id = req.body.id;

  if(!id || !password){
    return res.json({
      success: false,
      msg: '필수 입력값이 누락되었습니다.'
    })
  }

  if(id.toString().indexOf('kakao_') !== -1){

    return res.json({
      success: false,
      msg: '소셜회원은 비밀번호 수정이 불가능합니다.'
    })

  }


  let selectUser = 
  `
    SELECT *
    FROM users
    WHERE id = ?
  `

  try{

  const encoded = await encPwd(password);

  const user = await queryAsync(selectUser, [id])

  if(!user[0]){
    return res.json({
      success: false,
      msg: '해당 회원은 존재하지 않습니다.'
    })
  }

  let updateUser = 
  `
    UPDATE
      users
    SET
      password=?
    WHERE
      id=?
      AND
      del_yn = 'N'
  `;

  await queryAsync(updateUser, [encoded, user[0].id]);

  return res.json({
    success: true,
    msg: '비밀번호가 변경되었습니다.'
  })

  }catch(err){
    
    console.error(err);

    return res.json({
      success: false,
      msg: '서버에서 오류가 발생했습니다.\n잠시후 다시 시도해주세요.'
    })

  }
  

})


module.exports = router;