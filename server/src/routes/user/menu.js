const express = require('express');
const router = express.Router();
const db = require('../../databases/config/mysql');
const dotenv = require('dotenv');

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
    /** 
    * #swagger.tags = ['사용자/Menu']
    * #swagger.summary = '공모아 메뉴 불러오기 관련 로직'
    */
  let rtnMenu =  [];

  const selectOneDepth = `
    SELECT 
      menu_code,
      name,
      path
    FROM
      user_menu
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
          user_menu
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

module.exports = router;