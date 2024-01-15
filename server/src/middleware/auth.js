const db = require('../databases/config/mysql');
const { decodeJwt, encodeJwt } = require('../utils/jwt');

const auth = async(req, res, next) => {

  let token = req.headers.authorization;
  token = token?.replaceAll('Bearer', '');
  
  if(!token){
    return res.sendStatus(401);
  }

  //전달받은 토큰 파싱
  try{
    
    const decoded = await decodeJwt(token);
  
    if(!decoded._id){
      return res.sendStatus(401);
    }
  
    let selectUser = 
    `
      SELECT 
        id,
        email,
        name,
        htel,
        sms_yn,
        sms_time
      FROM
        users
      WHERE
        del_yn = 'N'
        AND id=?
    `

    //카카오 로그인일 경우
    if(decoded._id.toString().indexOf('kakao_') !== -1){
      selectUser = 
      `
      SELECT 
        id,
        email,
        name,
        htel,
        sms_yn,
        sms_time
      FROM
        sns_users
      WHERE
        del_yn = 'N'
        AND id=?

      `
    }
  
    db.query(selectUser, [decoded._id],(err, user) => {
  
      if(err){
        return next(err);
      }
  
      if(!user){
        return res.sendStatus(400).send("올바르지 않은 로그인 토큰입니다.");
      }
  
      let selectBookMark = 
      `
        SELECT ipo_id
        FROM bookmark
        WHERE user_id = ?
      `;
    
      db.query(selectBookMark, [decoded._id], async (err2, bookmark) => {
    
        if(err2){
          return next(err2);
        }
    
        const list = bookmark.map(item => item.ipo_id);

        let expiredIn = '1h';
        
        if(req.headers.remember){
          expiredIn = '30d';
        }

        user[0].bookmark = list;
        req.user = user[0];
        req.accessToken = await encodeJwt(user[0].id, expiredIn);
    
        return next();
      })

  
    })  

  }catch(error){

    //bookmark의 경우 로그아웃이나 세션 만료일 떄 중복으로 실행되어 에러 발생
    if(req.url === '/bookmark'){
      //bookmark인 경우만 따로 에러 발생하지 않는다.
      return res.json({
        bookmark:[]
      });
    }

    next(error);
  }


}


module.exports = auth;