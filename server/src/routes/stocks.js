const express = require('express');
const router = express.Router();
const db = require('../databases/config/mysql.js');

//공모주 리스트 
router.get('/', (req, res, next) => {

  let body = req.query;
  let value = [];
  body.keyword && value.push(body.keyword);
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
        i.st_forecast_dt <= NOW() AND i.end_forecast_dt >= NOW()
        OR
        i.st_sub <= NOW() AND i.end_sub >= NOW()
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
          i.st_forecast_dt <= NOW() AND i.end_forecast_dt >= NOW()
          OR
          i.st_sub <= NOW() AND i.end_sub >= NOW()
        )
      `;
      break;
    case 'forecast': 
      column = `'수요예측' as type`;
      condition = 'AND DATEDIFF(i.st_forecast_dt, now()) >= 0';
      orderBy = 'ABS(DATEDIFF(i.st_forecast_dt, NOW())) ASC';
      break;
      case 'sub': 
      column = `'청약' as type`;
      condition = 'AND DATEDIFF(i.st_sub, now()) >= 0';
      orderBy = 'ABS(DATEDIFF(i.st_sub, NOW())) ASC';
      break;

  }

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