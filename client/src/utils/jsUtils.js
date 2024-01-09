export const addComma = (price) => {

  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

}

export const setTagColor = (target) => {
  //증권사 태그 색을 리턴
  let color = 'yellow';
  switch(target.trim()){
    case '삼성증권' : 
      color = `border-blue-500 text-blue-500`;
      break;
    case '키움증권' : 
      color = 'border-purple-500 text-purple-500';
      break;
    case 'NH투자증권' : 
      color = 'border-green-500 text-green-500';
      break;
    case '하나증권':
      color = 'border-lime-500 text-lime-500';
      break;
    case '교보증권':
      color = 'border-teal-500 text-teal-500';
      break;
    case 'KB증권': case '케이비증권' :
      color = `border-sky-500 text-sky-500`;
      break;
    default : 
      color = `border-yellow-500 text-yellow-500`;
  }
  return color;
} 

export const compareNowDate = (st_date, end_date) => {
  //해당 날짜에 대하여 진행중인지

  let now_date = new Date(Date.now());

  return now_date >= new Date(st_date) && now_date <= new Date(end_date);

}

export const calculateDday = (targetDate) => {
  // 대상 날짜와 현재 날짜 구하기
  const target = new Date(targetDate);
  const now = new Date();

  // 날짜 차이 계산
  const timeDiff = target.getTime() - now.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return dayDiff + 1;
}