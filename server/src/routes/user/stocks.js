const express = require('express');
const router = express.Router();
const db = require('../../databases/config/mysql.js');

//공모주 리스트 
router.get('/', (req, res, next) => {

  let body = req.query;
  let value = [];
  body.keyword && value.push(body.keyword);
  body.menuType === 'bookmark' && value.push(body.setBookmark); //즐겨찾기 탭일 경우 북마크 목록 
  body.skip && value.push(Number(body.skip));
  body.limit && value.push(Number(body.limit));

  //메뉴 타입에 따라 쿼리 분기처리
  let column = 
  `
    CASE
      WHEN
        DATEDIFF(i.end_forecast_dt, now()) >= 0 THEN '수요예측' 
      WHEN 
        DATEDIFF(i.end_sub, now()) >= 0 THEN '청약'
      ELSE
        '청약마감'
    END AS type
  `;
  let condition = '';
  let orderBy = 
  `
    CASE
      WHEN 
        (DATE_FORMAT(i.st_sub, '%Y-%m-%d 00:00:00') <= NOW() AND DATE_FORMAT(i.end_sub, '%Y-%m-%d 23:59:59.999') >= NOW())
      THEN 4
      WHEN 
        (DATE_FORMAT(i.st_forecast_dt, '%Y-%m-%d 00:00:00') <= NOW() AND DATE_FORMAT(i.end_forecast_dt, '%Y-%m-%d 23:59:59.999') >= NOW())
      THEN 
        3
      WHEN 
        DATEDIFF(i.st_forecast_dt, now()) >= 0
        OR
        DATEDIFF(i.st_sub, now()) >= 0
      THEN 
        2
      ELSE 
        1
    END DESC, 
    ABS(DATEDIFF(i.st_forecast_dt, NOW())) ASC,
    ABS(DATEDIFF(i.st_sub, NOW())) ASC
  `;

  switch(body.menuType){
    case 'today' :
      condition = 
      `
        AND
        (
          DATE_FORMAT(i.st_forecast_dt, '%Y-%m-%d 00:00:00') <= NOW() AND DATE_FORMAT(i.end_forecast_dt, '%Y-%m-%d 23:59:59.999') >= NOW()
          OR
          DATE_FORMAT(i.st_sub, '%Y-%m-%d 00:00:00') <= NOW() AND DATE_FORMAT(i.end_sub, '%Y-%m-%d 23:59:59.999') >= NOW()
        )
      `;
      break;
    case 'forecast': 
      column = `'수요예측' as type`;
      condition = `
      AND 
      (
        (
          DATE_FORMAT(i.st_forecast_dt, '%Y-%m-%d 00:00:00') <= NOW() 
          AND DATE_FORMAT(i.end_forecast_dt, '%Y-%m-%d 23:59:59.999') >= NOW()
        ) 
        OR DATEDIFF(i.st_forecast_dt, now()) >= 0
      )
      `;
      orderBy = 'ABS(DATEDIFF(i.st_forecast_dt, NOW())) ASC';
      break;
      case 'sub': 
      column = `'청약' as type`;
      condition = `AND 
      (
        (
          DATE_FORMAT(i.st_sub, '%Y-%m-%d 00:00:00') <= NOW() 
          AND DATE_FORMAT(i.end_sub, '%Y-%m-%d 23:59:59.999') >= NOW()
          ) 
          OR DATEDIFF(i.st_sub, now()) >= 0
      )`;
      orderBy = 'ABS(DATEDIFF(i.st_sub, NOW())) ASC';
      break;
      case 'bookmark': 
      condition = 
      `
        AND i.ipo_id IN (?)
      `;
      break;

  }

  let selectQuery = 
  `
    SELECT
      i.ipo_id,
      i.corp_nm,
      DATE_FORMAT(i.st_sub, '%Y-%m-%d 00:00:00') as st_sub_str,
      DATE_FORMAT(i.end_sub, '%Y-%m-%d 23:59:59') as end_sub_str,
      i.st_sub,
      i.end_sub,
      i.confirmed_price,
      i.st_hope_price,
      i.end_hope_price,
      i.comp_ratio,
      i.weekly_company,
      i.total_stock,
      i.face_price,
      i.assign_dt,
      i.st_forecast_dt,
      i.end_forecast_dt,
      i.payment_dt,
      i.refund_dt,
      i.list_dt,
      DATE_FORMAT(i.st_forecast_dt, '%Y-%m-%d 00:00:00') as st_forecast_dt_str,
      DATE_FORMAT(i.end_forecast_dt, '%Y-%m-%d 23:59:59') as end_forecast_dt_str,
      DATE_FORMAT(i.payment_dt, '%Y-%m-%d 00:00:00') as payment_dt_str,
      DATE_FORMAT(i.refund_dt, '%Y-%m-%d 00:00:00') as refund_dt_str,
      DATE_FORMAT(i.list_dt, '%Y-%m-%d 00:00:00') as list_dt_str,
      c.listed_type,
      c.stock_type,
      ${column}
    FROM
      ipo i,
      corp_info c
    WHERE
      i.ipo_id = c.ipo_id
      ${body.keyword ? "AND (LOWER(i.corp_nm) LIKE CONCAT('%', LOWER(?) , '%'))" : ""}
      ${condition}
    ORDER BY 
      ${orderBy}
    LIMIT ?, ?
    
  `;

  db.query(selectQuery, value, (error, stock_list) => {

    if(error) {
      console.log(`ipo list 조회 중 오류 발생: ${error}`);
      return false;
    }

      res.send(stock_list);


  })

})

router.get(`/calendar`, (req, res, next) => {

  let body = req.query;

  let condition =   `
      AND
      i.list_dt >= DATE(?) AND i.list_dt <= DATE(?)
    `;

  if(body.type === 'S'){
    //공모주 정보 반환
    condition = `
      AND
      i.st_sub >= DATE(?) AND i.end_sub <= DATE(?)
    `
  }else if(body.type === 'R'){
    condition = `
      AND
      i.refund_dt >= DATE(?) AND i.refund_dt <= DATE(?)
    `
  }

  //즐겨찾기만 셀렉트
  if( JSON.parse( body.setBookmark ) ){
    condition += 
    `
      AND i.ipo_id IN (?)
    `
  }

  let selectQuery = 
  `
    SELECT
      i.ipo_id,
      i.corp_nm,
      DATE_FORMAT(i.st_sub, '%Y-%m-%d') as st_sub_str,
      DATE_FORMAT(DATE_ADD(i.end_sub, INTERVAL 1 DAY), '%Y-%m-%d') as end_sub_str,
      DATE_FORMAT(i.st_forecast_dt, '%Y-%m-%d') as st_forecast_dt_str,
      DATE_FORMAT(DATE_ADD(i.end_forecast_dt, INTERVAL 1 DAY), '%Y-%m-%d') as end_forecast_dt_str,
      DATE_FORMAT(i.payment_dt, '%Y-%m-%d') as payment_dt_str,
      DATE_FORMAT(i.refund_dt, '%Y-%m-%d') as refund_dt_str,
      DATE_FORMAT(i.list_dt, '%Y-%m-%d') as list_dt_str
    FROM
      ipo i,
      corp_info c
    WHERE
      i.ipo_id = c.ipo_id
    ${condition}
  `;

  db.query(selectQuery, [body.str_dt, body.end_dt, body.bookmark], (err, stocks) => {

    if(err) {
      // console.log(err);
      return next(err);
    }
    return res.json({
      stocks: stocks
    })

  })

})

//공모주 상세페이지 조회
router.get('/:stockId', (req, res, next) => {
  
  let params = req.params;

  let selectQuery = 
  `
    SELECT
      i.ipo_id,
      i.corp_nm,
      DATE_FORMAT(i.st_sub, '%Y-%m-%d') as st_sub_str,
      DATE_FORMAT(i.end_sub, '%Y-%m-%d') as end_sub_str,
      i.st_sub,
      i.end_sub,
      i.confirmed_price,
      i.st_hope_price,
      i.end_hope_price,
      i.comp_ratio,
      i.weekly_company,
      i.total_stock,
      i.face_price,
      i.assign_dt,
      i.st_forecast_dt,
      i.end_forecast_dt,
      i.payment_dt,
      i.refund_dt,
      i.list_dt,
      DATE_FORMAT(i.st_forecast_dt, '%Y-%m-%d') as st_forecast_dt_str,
      DATE_FORMAT(i.end_forecast_dt, '%Y-%m-%d') as end_forecast_dt_str,
      DATE_FORMAT(i.payment_dt, '%Y-%m-%d') as payment_dt_str,
      DATE_FORMAT(i.refund_dt, '%Y-%m-%d') as refund_dt_str,
      DATE_FORMAT(i.list_dt, '%Y-%m-%d') as list_dt_str,
      c.listed_type,
      c.stock_type,
      c.stock_code,
      c.sector,
      c.corp_hp,
      c.corp_tel,
      c.corp_rep,
      c.corp_type,
      c.largest_share_holder,
      c.corp_addr
    FROM
      ipo i,
      corp_info c
    WHERE
      i.ipo_id = c.ipo_id
      AND i.ipo_id = ?    
  `;

  db.query(selectQuery, [params.stockId], (err, stock) => {

    if(err){
      return next(err);
    }

    if(!stock[0]){
      return res.json({
        success: false,
        message: '해당 공모주는 존재하지 않습니다.'
      })
    }//end if

    //  해당 공모주의 수요예측 정보를 가져온다
    let selectDemand = 
    `
      SELECT 
        price,
        count
      FROM 
        ipo_demand_forecast
      WHERE
        ipo_id = ?
      ORDER BY
        price DESC
    `;

    db.query(selectDemand, [params.stockId], (err2, demand) => {

      if(err2){
        return next(err2);
      }

      return res.json({
        success: true,
        stockDetail : stock[0],
        demandList : demand
      });

    })



  })


})




module.exports = router;