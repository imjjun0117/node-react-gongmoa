const express = require('express');
const router = express.Router();
const db = require('../../databases/config/mysql');
const dotenv = require('dotenv');
const ipoParsing = require('../../databases');
const { authAdminGuest } = require('../../middleware/auth');

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

router.get('/ipoList', async(req, res, next) => {

  /** 
  * #swagger.tags = ['관리자/Stocks']
  * #swagger.summary = '공모주 관리 - 공모주 불러오기'
  */

  let query = req.query;

  let type_arr = ['corp_nm', 'weekly_company', 'stock_code', ''];
  let type_target_arr = ['i.corp_nm', 'i.weekly_company', 'c.stock_code', ''];

  let pp = Number( query.pp ? query.pp : 10 );
  let pg = Number( query.pg ? query.pg : 1 );
  let use_yn = query.use_yn ? query.use_yn : "";
  let keyword = query.keyword ? query.keyword : "";
  let type = query.type ? query.type : "";
  let stock_type = query.stock_type ? query.stock_type : "";
  let listed_type = query.listed_type ? query.listed_type : "";

  let searchArr = [use_yn];

  if(type_arr.indexOf(type) === -1){
    type = '';
  }else{
    type = type_target_arr[type_arr.indexOf(type)]
  }

  searchArr.push(keyword);
  if(!type){
    searchArr.push(keyword);
    searchArr.push(keyword);
  }

  searchArr.push(stock_type);
  searchArr.push(listed_type);

  
  let selectIpoList = 
  `
  SELECT 
    *
  FROM (
    SELECT 
      i.corp_nm,
      DATE_FORMAT(i.st_sub, '%Y-%m-%d') AS st_sub,
      DATE_FORMAT(i.end_sub, '%Y-%m-%d') AS end_sub,
      i.weekly_company,
      i.use_yn,
      i.update_yn,
      i.ipo_id,
      c.stock_type,
      c.stock_code,
      c.corp_type,
      c.listed_type,
      DATE_FORMAT(c.reg_dt, '%Y-%m-%d') AS reg_dt,
      DATE_FORMAT( c.update_dt, '%Y-%m-%d') AS update_dt
    FROM ipo i
    INNER JOIN corp_info c
    ON i.ipo_id = c.ipo_id
    WHERE 
      1=1
      AND
      use_yn like CONCAT(?,'%')
      ${
        type ? 
        `AND UPPER(${type }) LIKE UPPER( CONCAT(CONCAT('%', ?), '%') )` 
        : 
        `AND (
          UPPER(i.corp_nm) LIKE UPPER( CONCAT(CONCAT('%', ?), '%') )
          OR
          UPPER(i.weekly_company) LIKE UPPER( CONCAT(CONCAT('%', ?), '%') )
          OR
          UPPER(c.stock_code) LIKE UPPER( CONCAT(CONCAT('%', ?), '%') )
          )`
        }
        AND
        UPPER(c.stock_type) LIKE CONCAT(?, '%')
        AND
        UPPER(c.listed_type) LIKE CONCAT(?, '%')
    ORDER BY 
      i.ipo_id DESC
  ) LASTROW

  LIMIT ? OFFSET ?
  
  `

  let selectTotalRowNum = 
  `
    SELECT 
      COUNT(*) AS cnt
    FROM ipo i
    INNER JOIN corp_info c
    ON i.ipo_id = c.ipo_id
    WHERE 
      1=1
      AND
      use_yn like CONCAT(?,'%')
      ${
        type ? 
        `AND UPPER(${type }) LIKE UPPER( CONCAT(CONCAT('%', ?), '%') )` 
        : 
        `AND (
          UPPER(i.corp_nm) LIKE UPPER( CONCAT(CONCAT('%', ?), '%') )
          OR
          UPPER(i.weekly_company) LIKE UPPER( CONCAT(CONCAT('%', ?), '%') )
          OR
          UPPER(c.stock_code) LIKE UPPER( CONCAT(CONCAT('%', ?), '%') )
          )`
        }
        AND
        UPPER(c.stock_type) LIKE CONCAT(?, '%')
        AND
        UPPER(c.listed_type) LIKE CONCAT(?, '%')
  
  `
try{

  const count = await queryAsync(selectTotalRowNum, searchArr);

  searchArr.push(pp);
  searchArr.push((pg - 1) * pp);
  
  const ipoList = await queryAsync(selectIpoList, searchArr);

  return res.json({
    ipo_list : ipoList,
    success: true,
    totalRowNum : count[0].cnt
  })

}catch(err){

  console.error(err);

  return res.json({
    success: false,
    msg: '서버에서 오류가 발생했습니다.\n잠시후 다시 시도해주세요.'
  })

}



})


router.post('/setIpoStatus', authAdminGuest, async (req, res, next) => {

  /** 
  * #swagger.tags = ['관리자/Stocks']
  * #swagger.summary = '공모주 관리 - 공모주 상태변경'
  */
  
  let body = req.body;

  if(!body.value || !body.ipo_id || !body.type) {
    return res.json({
      success: false,
      msg: '잘못된 접근입니다.'
    })
  }

  if(body.type !== 'update_yn' && body.type !== 'use_yn'){
    return res.json({
      success: false,
      msg: '잘못된 접근입니다.'
    })
  }


  let selectIpo = 
  `
    SELECT 
      * 
    FROM ipo 
    WHERE ipo_id = ?
  `

  try{

    const ipo = await queryAsync(selectIpo, [body.ipo_id]);

    if(!ipo[0]){
      return res.json({
        success: false,
        msg: '해당 공모주는 존재하지 않습니다.'
      })
    }

    let updateIpoStatus = 
    `
      UPDATE
        ipo
      SET
        ${body.type}=?
      WHERE
        ipo_id = ?
    `
    
    const result = await queryAsync(updateIpoStatus, [body.value, body.ipo_id]);

    return res.json({
      success: true,
      msg:`${body.type === 'update_yn' ? '업데이트 사용여부' : '사용여부'} 변경에 성공하였습니다.`
    })

  }catch(err){

    return res.json({
      success: false,
      msg : '서버에서 오류가 발생했습니다.\n잠시후 다시 시도해주세요.'
    })
  }


})


router.get("/getIpoDetail", async (req, res, next) => {

 /** 
  * #swagger.tags = ['관리자/Stocks']
  * #swagger.summary = '공모주 관리 - 공모주 상세 불러오기'
  */

  let query = req.query;

  if(!query.ipoId){
    return res.json({
      success: false,
      msg: '잘못된 접근입니다.'
    })
  }


  let selectIpoDetail = 
  `
    SELECT
      i.ipo_id,
      i.corp_nm,
      DATE_FORMAT(i.st_sub, '%Y-%m-%d') AS st_sub,
      DATE_FORMAT(i.end_sub, '%Y-%m-%d') AS end_sub,
      i.confirmed_price,
      i.st_hope_price,
      i.end_hope_price,
      i.comp_ratio,
      i.weekly_company,
      i.total_stock,
      i.face_price,
      DATE_FORMAT(i.st_forecast_dt, '%Y-%m-%d') AS st_forecast_dt,
      DATE_FORMAT(i.end_forecast_dt, '%Y-%m-%d') AS end_forecast_dt,
      DATE_FORMAT(i.payment_dt, '%Y-%m-%d') AS payment_dt,
      DATE_FORMAT(i.refund_dt, '%Y-%m-%d') AS refund_dt,
      DATE_FORMAT(i.list_dt, '%Y-%m-%d') AS list_dt,
      DATE_FORMAT( i.assign_dt, '%Y-%m-%d') AS assign_dt,
      i.update_yn,
      i.use_yn,
      c.listed_type,
      c.stock_type,
      c.stock_code,
      c.sector,
      c.corp_rep,
      c.corp_type,
      c.corp_addr,
      c.corp_hp,
      c.corp_tel,
      c.largest_share_holder,
      c.reg_dt,
      c.update_dt
    FROM
      ipo i
    INNER JOIN
      corp_info c
    ON
      i.ipo_id = c.ipo_id
    WHERE
      i.ipo_id = ?

  `

  try{

    const ipoDetail = await queryAsync(selectIpoDetail, [query.ipoId])

    if(!ipoDetail[0]){
      return res.json({
        success: false,
        msg: '해당 공모주는 존재하지 않습니다.'
      })
    }

    return res.json({
      success: true,
      ipoDetail : ipoDetail[0]
    })

  }catch(err){

    console.error(err)

    return res.json({
      success: false,
      msg: '서버에서 문제가 발생했습니다.\n잠시후 다시 시도해주세요.'
    })

  }


})


//공모주 수정
router.post('/modifyIpoDetail', authAdminGuest, async(req, res, next) => {

  /** 
  * #swagger.tags = ['관리자/Stocks']
  * #swagger.summary = '공모주 관리 - 공모주 상세 수정하기'
  */

  let body = req.body;

  //유효성 검사
  if(
    !body.ipo_id ||
    !body.corp_nm ||
    !body.st_sub ||
    !body.end_sub ||
    !body.weekly_company ||
    !body.total_stock ||
    !body.face_price ||
    !body.stock_code ||
    !body.stock_type ||
    !body.listed_type ||
    !body.sector ||
    !body.act
  ){
    return res.json({
      success: false,
      msg: '필수 입력값이 누락되었습니다.'
    })
  }

  //DATE 타입 null처리
  body.st_sub = body.st_sub ? body.st_sub : null;
  body.end_sub = body.end_sub ? body.end_sub : null;
  body.list_dt = body.list_dt ? body.list_dt : null;
  body.payment_dt = body.payment_dt ? body.payment_dt : null;
  body.refund_dt = body.refund_dt ? body.refund_dt : null;
  body.st_forecast_dt = body.st_forecast_dt ? body.st_forecast_dt : null;
  body.end_forecast_dt = body.end_forecast_dt ? body.end_forecast_dt : null;
  body.confirmed_price = body.confirmed_price ? body.confirmed_price : 0;
  body.st_hope_price = body.st_hope_price ? body.st_hope_price : 0;
  body.end_hope_price = body.end_hope_price ? body.end_hope_price : 0;
  body.total_stock = body.total_stock ? body.total_stock : 0;
  body.face_price = body.face_price ? body.face_price : 0;


  let selectIpo = 
  `
    SELECT
      *
    FROM ipo
    WHERE ipo_id = ?
  
  `;

  let selectCorpInfo = `
    SELECT 
      *
    FROM corp_info
    WHERE ipo_id = ?
  `


try{
  const ipo = await queryAsync(selectIpo, [body.ipo_id]);
  const corp_info = await queryAsync(selectCorpInfo, [body.ipo_id]);

  if(body.act === "U"){

    if(!ipo[0] || !corp_info[0]){
      return res.json({
        success: false,
        msg: '해당 공모주는 존재하지 않습니다.'
      })
    }

    let updateIpo = 
    `
      UPDATE
        ipo
      SET
        corp_nm = ?,
        st_sub = ?,
        end_sub = ?,
        confirmed_price = ?,
        st_hope_price = ?,
        end_hope_price = ?,
        comp_ratio = ?,
        weekly_company = ?,
        total_stock = ?,
        face_price = ?,
        list_dt = ?,
        payment_dt = ?,
        refund_dt = ?,
        st_forecast_dt = ?,
        end_forecast_dt = ?,
        update_yn = ?,
        use_yn = ?
      WHERE 
        ipo_id = ?
    `

    let updateIpoArr = 
    [
      body.corp_nm,
      body.st_sub,
      body.end_sub,
      body.confirmed_price,
      body.st_hope_price,
      body.end_hope_price,
      body.comp_ratio,
      body.weekly_company,
      body.total_stock,
      body.face_price,
      body.list_dt,
      body.payment_dt,
      body.refund_dt,
      body.st_forecast_dt,
      body.end_forecast_dt,
      body.update_yn,
      body.use_yn,
      body.ipo_id
    ]

    await queryAsync(updateIpo, updateIpoArr);

    let updateCorpInfo = 
    `
      UPDATE
        corp_info
      SET
        stock_code = ?,
        stock_type = ?,
        sector = ?,
        listed_type = ?,
        corp_rep = ?,
        corp_type = ?,
        corp_addr = ?,
        corp_hp = ?,
        corp_tel = ?,
        largest_share_holder = ?,
        update_dt = NOW()
      WHERE 
        ipo_id = ?

    `

    let updateCorpInfoArr = 
    [
      body.stock_code,
      body.stock_type,
      body.sector,
      body.listed_type,
      body.corp_rep,
      body.corp_type,
      body.corp_addr,
      body.corp_hp,
      body.corp_tel,
      body.largest_share_holder,
      body.ipo_id
    ]

    await queryAsync(updateCorpInfo, updateCorpInfoArr);

    return res.json({
      success: true,
      msg: '수정에 성공하였습니다.'
    })

  }else{

    if(ipo[0] || corp_info[0]){
      return res.json({
        success: false,
        msg: '해당 공모주는 이미 존재합니다.'
      })
    }

    let insertIpo = 
    `
      INSERT INTO 
        ipo 
        (
          ipo_id,
          corp_nm,
          st_sub,
          end_sub,
          confirmed_price,
          st_hope_price,
          end_hope_price,
          comp_ratio,
          weekly_company,
          total_stock,
          face_price,
          list_dt,
          payment_dt,
          refund_dt,
          st_forecast_dt,
          end_forecast_dt,
          update_yn,
          use_yn 
        )
      VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )

    `

    let insertIpoArr = 
    [
      body.ipo_id,
      body.corp_nm,
      body.st_sub,
      body.end_sub,
      body.confirmed_price,
      body.st_hope_price,
      body.end_hope_price,
      body.comp_ratio,
      body.weekly_company,
      body.total_stock,
      body.face_price,
      body.list_dt,
      body.payment_dt,
      body.refund_dt,
      body.st_forecast_dt,
      body.end_forecast_dt,
      body.update_yn,
      body.use_yn
    ]

    await queryAsync(insertIpo, insertIpoArr);

    let insertCorpInfo = 
    `
      INSERT INTO 
        corp_info
        (
          ipo_id,
          stock_code,
          stock_type,
          sector,
          listed_type,
          corp_rep,
          corp_type,
          corp_addr,
          corp_hp,
          corp_tel,
          largest_share_holder,
          reg_dt
        )
      VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          NOW()
        )
    `

    let insertCorpInfoArr = 
    [
      body.ipo_id,
      body.stock_code,
      body.stock_type,
      body.sector,
      body.listed_type,
      body.corp_rep,
      body.corp_type,
      body.corp_addr,
      body.corp_hp,
      body.corp_tel,
      body.largest_share_holder
    ]

    await queryAsync(insertCorpInfo, insertCorpInfoArr);

    return res.json({
      success: true,
      msg: '등록에 성공하였습니다.'
    })

  }


}catch(err){
  console.error(err);
  return res.json({
    success: false,
    msg: '서버에서 오류가 발생했습니다.\n잠시후 다시 시도해주세요.'
  })
}


})


//공모주 불러오기
router.post('/loadIpo', authAdminGuest, async (req, res, next) => {

   /** 
    * #swagger.tags = ['관리자/Stocks']
    * #swagger.summary = '공모주 불러오기 - 공모주 업데이트 관련 로직'
    */

    let body = req.body;

    if(!body.update_st_num || !body.update_end_num){
      return res.json({
        success: false,
        msg: '필수 입력값이 누락되었습니다.'
      })
    }

    if(Number(body.update_st_num) > Number(body.update_end_num)){
      return res.json({
        success: false,
        msg: '시작 갯수가 종료 갯수보다 높을수는 없습니다.'
      })
    }

    let start = Math.floor(body.update_st_num / 30) + 1;
    let end = Math.ceil(body.update_end_num / 30);

    for(let i = start; i <= end; i++){
      ipoParsing(i);
    }

    return res.json({
      success: true,
      msg: '업데이트를 성공하였습니다.'
    })

})

module.exports = router;