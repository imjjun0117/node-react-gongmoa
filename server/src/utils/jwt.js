const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//사용자 id를 받아 token을 생성하고 localstorage에 저장한다.
const encodeJwt = async (user_id) => {

  const accessToken = jwt.sign({_id: user_id}, process.env.SECRET_KEY, {expiresIn: '1h'});

  return accessToken;

}

const decodeJwt = async (token) => {

  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  return decoded;

}

module.exports = {encodeJwt, decodeJwt}