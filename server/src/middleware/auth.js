const db = require('../databases/config/mysql');
const { decodeJwt } = require('../utils/jwt');



const auth = async(req, res, next) => {

  let token = req.headers.authorization;

  if(!token){
    return res.sendStatus(401).send("올바르지 않은 로그인 토큰입니다.");
  }

  //전달받은 토큰 파싱
  token = token.replaceAll('Gongmoa_', '');

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
    return next(error);
  }


}


module.exports = auth;