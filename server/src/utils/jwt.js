const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
dotenv.config();

//사용자 id를 받아 token을 생성하고 localstorage에 저장한다.
const encodeJwt = async (user_id, expiredIn) => {

  const accessToken = jwt.sign({_id: user_id}, process.env.SECRET_KEY, {expiresIn: expiredIn});

  return accessToken;

}

const decodeJwt = async (token) => {

  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  return decoded;

}

const encPwd = async (password) => {
  
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  
  return hash;
  
}

module.exports = {encodeJwt, decodeJwt, encPwd}