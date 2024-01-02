const bcrypt = require('bcryptjs');
const saltRounds = 10;

//비밀번호 암호화관련 미들웨서
const enc = async(req, res, next) => {

  if(req.body.password){
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.password, salt);
  
    req.body.password = hash;
  }

  next();
}

module.exports = {enc}
