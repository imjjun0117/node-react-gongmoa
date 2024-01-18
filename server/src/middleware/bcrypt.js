const bcrypt = require('bcryptjs');
const saltRounds = 10;

//비밀번호 암호화관련 미들웨서
const enc = async(req, res, next) => {

  //비밀번호 유효성 검사
  let patternPassword =  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;

  if(!patternPassword.test(req.body.password)){
    return res.json({
      success: false,
      message: "비밀번호는 영문, 숫자, 특수문자 포함 8 ~ 16자로 입력해주세요."
    })
  }


  if(req.body.password){
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.password, salt);
  
    req.body.password = hash;
  }

  next();
}

module.exports = {enc}
