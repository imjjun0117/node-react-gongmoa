
const replaceTxt = (originTxt) => {
  //특수문자 치환

  originTxt = originTxt.replaceAll('&nbsp;','');

  return originTxt.trim();

}



module.exports = {replaceTxt};