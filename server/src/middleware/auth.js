const db = require('../databases/config/mysql');
const { decodeJwt } = require('../utils/jwt');

const auth = async(req, res, next) => {

  let token = req.headers.authorization;
  token = token?.replaceAll('Gongmoa_', '');
  
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
        htel
      FROM
        users
      WHERE
        del_yn = 'N'
        AND id=?
    `

    if(decoded._id.indexOf('kakao_') !== -1){
      selectUser = 
      `
      SELECT 
        id,
        email,
        name,
        htel
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
  
      req.user = user[0];
      req.accessToken = token;
  
      return next();
  
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