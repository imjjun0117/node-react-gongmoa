const express = require('express');
const router = express.Router();
const db = require('../../databases/config/mysql');
const dotenv = require('dotenv');
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

router.post('/isMenuValid', async (req, res, next) => {

  /** 
  * #swagger.tags = ['관리자/AdminMenu']
  * #swagger.summary = '관리자 메뉴 불러올때 사용여부 확인 로직'
  */

  let body = req.body;

  if(!body.menu_path){
    return res.json({
      success: false,
      msg: '잘못된 접근입니다.'
    })
  }

  const selectDepth = 
  `
    SELECT
      use_yn
    FROM 
      admin_menu
    WHERE 
      path=?
  `

  const menu = await queryAsync(selectDepth, [body.menu_path]);
  
  if(menu.length === 0){
    return res.json({
      success:false,
      msg: '잘못된 접근입니다.'
    })
  }

  let success = true;
  let msg = '';


  if(menu[0].use_yn === 'N'){
    success = false;
    msg = '해당 메뉴는 사용 불가 메뉴입니다.'
  }

  return res.json({
    success,
    msg
  })

})

router.get('/menu', async (req, res, next) => {

  /** 
  * #swagger.tags = ['관리자/AdminMenu']
  * #swagger.summary = '관리자 메뉴 불러오기 로직'
  */

  let rtnMenu =  [];

  const selectOneDepth = `
    SELECT 
      menu_code,
      name,
      path
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
          path
        FROM
          admin_menu
        WHERE 
          use_yn = 'Y'
          AND menu_code LIKE CONCAT(?, '%')
          AND CHAR_LENGTH(menu_code) = COALESCE(CHAR_LENGTH(?), 0) + 3
        ORDER BY
          sort_num
      `;

      const twoDepth = await queryAsync(selectTwoDepth, [menu.menu_code, menu.menu_code]);

      let oneDepthJson = {
        title: menu.name,
        layout: 'aoslwj7110',
        path: menu.path,
        pages: twoDepth.map(menu2 => ({
          name: menu2.name,
          path: menu2.path
        }))
      };

      rtnMenu.push(oneDepthJson);
    }

    res.json({ rtnMenu });
  } catch (err) {
    next(err);
  }
});


router.get('/adminMenuList', async (req, res, next) => {

   /** 
  * #swagger.tags = ['관리자/AdminMenu']
  * #swagger.summary = '관리자 메뉴 관리 - 리스트 불러오기 로직'
  */

  let body = req.query;

  let pg = Number(body.pg ? body.pg : 1); // 페이지
  let pp = Number(body.pp ? body.pp : 10); // 페이지에 보여줄 리스트 갯수

  let bind = [];
  let p_name = '최상위';

  //부모 메뉴명 조회
  if(body.parentCode){
    
    bind.push(body.parentCode);
    bind.push(body.parentCode);

    let p_menu = await queryAsync(`
      SELECT 
        name
      FROM admin_menu
      WHERE menu_code=?
    `, [body.parentCode])

    if(!p_menu[0]){
      return res.json({
        success: false,
        msg: '해당 상위 메뉴가 존재하지 않습니다.'
      })
    }

    p_name = p_menu[0].name; 

  }//end if
  
  bind = [...bind, pp, (pg - 1) * pp];

  let selectMenu = 
  `
    SELECT 
      * 
    FROM (
      SELECT 
        menu_code,
        name,
        DATE_FORMAT(reg_dt, '%Y-%m-%d') AS reg_dt,
        DATE_FORMAT(update_dt, '%Y-%m-%d') AS update_dt,
        use_yn
      FROM
        admin_menu
      WHERE 
        1 = 1
        ${body.parentCode ? 
        `
          AND menu_code LIKE CONCAT(?, '%')
          AND CHAR_LENGTH(menu_code) = COALESCE(CHAR_LENGTH(?), 0) + 3
        ` : 
        `
          AND CHAR_LENGTH(menu_code) = 3
        `
      }
      ORDER BY
        sort_num
    ) LASTROW
    LIMIT ? OFFSET ?
  
  `
  
  let result = await queryAsync(selectMenu, bind)

  let seletcMenuCnt = 
  `
  
      SELECT 
        COUNT(*) AS cnt
      FROM
        admin_menu
      WHERE 
        1 = 1
        ${body.parentCode ? 
        `
          AND menu_code LIKE CONCAT(?, '%')
          AND CHAR_LENGTH(menu_code) = COALESCE(CHAR_LENGTH(?), 0) + 3
        ` : 
        `
          AND CHAR_LENGTH(menu_code) = 3
        `
      }

  `

  let count = await queryAsync(seletcMenuCnt, [body.parentCode, body.parentCode])

  return res.json({
    success: true,
    menu_list : result,
    p_name,
    totalRowNum: count[0].cnt
  })

})

router.post('/setAdminMenuStatus', authAdminGuest, async (req, res, next) => {

   /** 
  * #swagger.tags = ['관리자/AdminMenu']
  * #swagger.summary = '관리자 메뉴 관리 - 상태변경 로직'
  */

  let body = req.body;

  let updateStatus = 
  `
    UPDATE admin_menu
    SET 
      use_yn = ?,
      update_dt = NOW()
    WHERE
      menu_code = ?
  `

  try{
    
    await queryAsync(updateStatus, [body.value, body.menu_code]);

    return res.json({
      result : true,
      msg: '사용여부 변경을 성공하였습니다.'
    })

  }catch(err){
    return res.json({
      result : false,
      msg : '상태 변경 중 문제가 발생하였습니다.\n잠시후 다시 시도해주세요.'
    })
  }

  

})

//메뉴 등록시에 가장 큰 메뉴 코드 반환
router.get('/getAdminMenuCode', async (req, res, next) => {

  /** 
  * #swagger.tags = ['관리자/AdminMenu']
  * #swagger.summary = '관리자 메뉴 관리 - 부모코드 조회 로직'
  */

  let params = req.query;

  //1뎁스, 2뎁스 이외일 경우
  if(params.code?.length > 3){

    return res.json({
      success: false,
      msg: '해당 메뉴 코드를 생성할 수 없습니다.'
    })

  }//end if

  //메뉴 코드가 없을경우
  if(!params.code){
    params.code = '';
  }

  let selectMenuCode = 
  `
    SELECT 
      CONCAT(
        ?,
        CONCAT('00', 
        IFNULL(
          MAX(
          SUBSTRING(menu_code, length(?)+1, length(menu_code)) 
          ), 0) + 1
        ) 
      )
        AS menu_code
    FROM 
      admin_menu
    WHERE 
      LENGTH(menu_code) = COALESCE(CHAR_LENGTH(?), 0) + 3
      AND
      menu_code LIKE CONCAT(COALESCE(?), '%')
  
  `
  
  try{
    const menu = await queryAsync(selectMenuCode, [params.code, params.code, params.code, params.code])

    return res.json({
      success: true,
      code: menu[0].menu_code
    })

  }catch(err){
    return next(err);
  }

  


})

//메뉴 등록시 디테일
router.get('/getAdminMenuDetail', async (req, res, next) => {

  /** 
  * #swagger.tags = ['관리자/AdminMenu']
  * #swagger.summary = '관리자 메뉴 관리 - 상세 조회 로직'
  */

  let params = req.query;

  if(!params.code){
    return res.json({
      success: false,
      msg: '잚못된 접근입니다.'
    })
  }

  let selectMenu = 
  `
    SELECT 
      menu_code,
      name,
      path,
      use_yn
    FROM 
      admin_menu
    WHERE
      menu_code=?
  `

  try{
    const menu = await queryAsync(selectMenu, [params.code])
    return res.json({
      success: true,
      menu: menu[0]
    })

  }catch(err){
    return next(err);
  }

})

//관리자 메뉴 수정 로직
router.post('/modifyAdminMenu', authAdminGuest, authAdminGuest, async (req, res, next) => {

  /** 
  * #swagger.tags = ['관리자/AdminMenu']
  * #swagger.summary = '관리자 메뉴 관리 - 메뉴 수정 로직'
  */

  
  try{

    let body = req.body;
  
    if(
      !body.act || !body.menu_code || 
      !body.menu_name || !body.menu_path || !body.use_yn
      ){
  
      return res.json({
        success: false,
        msg: "필수 입력값이 누락되었습니다."
      })
      
    }
  
    let selectMenu = 
    `
      SELECT
        * 
      FROM 
        admin_menu
      WHERE 
        menu_code = ?
    `
  
    const menu = await queryAsync(selectMenu, [body.menu_code])
  
    if(body.act === "I"){
  
      //DB 존재여부 확인
      if(menu[0]){
  
        return res.json({
          success: false,
          msg: "해당 메뉴코드는 이미 존재합니다."
        })
  
      }
  
      let insertMenu = 
      `
        INSERT INTO admin_menu
        (
          menu_code,
          name,
          path,
          reg_dt,
          use_yn,
          sort_num
        )
        VALUES
        (
          ?,
          ?,
          ?,
          NOW(),
          ?,
          (
            SELECT IFNULL(MAX(a.sort_num), 0) +1 as sort_num
            FROM 
              admin_menu a
            WHERE
              LENGTH(a.menu_code) = LENGTH(?)
              AND a.menu_code LIKE CONCAT(SUBSTRING(?, 1, LENGTH(?) - 3), '%')
          )
  
        )
      
      `
  
      const result = await queryAsync(insertMenu, 
        [body.menu_code, body.menu_name, body.menu_path, body.use_yn, body.menu_code, body.menu_code, body.menu_code]
        );
  
      return res.json({
        success: true,
        msg: "메뉴 등록을 완료했습니다."
      })
  
    }else{

      if(!menu[0]){
        return res.json({
          success: false,
          msg: '해당 메뉴가 존재하지 않습니다.'
        })
      }

      let updateMenu = 
      `
        UPDATE admin_menu
        SET
          name=?,
          path=?,
          use_yn=?,
          update_dt=NOW()
        WHERE 
          menu_code=?
      `

      const result = await queryAsync(updateMenu,[body.menu_name, body.menu_path, body.use_yn, body.menu_code]);

      return res.json({
        success: true,
        msg: '메뉴 수정을 완료하였습니다.'
      })

    }//end else

  }catch(err){
    return next(err)
  }


})


//관리자 메뉴코드 순서변경 로직
router.post('/setAdminMenuOrder',authAdminGuest, authAdminGuest, (req, res, next) => {

   /** 
  * #swagger.tags = ['관리자/AdminMenu']
  * #swagger.summary = '관리자 메뉴 관리 - 메뉴 순서변경 로직'
  */

  let body = req.body;
  let parentCode = body.parentCode ? body.parentCode : '';

  //넘어온 데이터 유효성 검사
  body?.menu_list.map(async(menu) => {
    
    if(menu.menu_code.length !== parentCode.length + 3){
      return res.json({
        success: false,
        msg: '잘못된 접근입니다.'
      })
    }
    
    // 부모 메뉴 유효성 검사
    if(parentCode){

      if(menu.menu_code.substring(0, parentCode.length) !== parentCode){

        return res.json({
          success: false,
          msg: '잘못된 접근입니다.'
        })

      }//end if

    }//end if

    let selectMenu = 
    `
      SELECT 
        *
      FROM 
        admin_menu
      WHERE 
        menu_code=?
    `

    const rtnMenu = await queryAsync(selectMenu, [menu.menu_code]);

    if(!rtnMenu[0]){
      return res.json({
        success: false,
        msg: '잘못된 접근입니다.'
      })
    }

  })

  //순서 업데이트
  body?.menu_list.map(async( menu, index ) => {

    let updateMenu = 
    `
      UPDATE
        admin_menu
      SET
        sort_num = ?
      WHERE 
        menu_code = ?
    `

    await queryAsync(updateMenu, [index, menu.menu_code]);

  })

  return res.json({
    success: true,
    msg: '순서변경을 성공하였습니다.'
  })

})

module.exports = router;