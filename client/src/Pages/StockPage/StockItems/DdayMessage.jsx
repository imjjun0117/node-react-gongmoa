import React from 'react'
import { calculateDday } from '../../../utils/jsUtils';

//공모주 디데이 계산 컴포넌트
const DdayMessage = ({stock}) => {

  let start_dt, end_dt;
  let now_dt = new Date(Date.now());
  let day = ['일', '월', '화', '수', '목', '금', '토'];

  if(stock.type === '청약'){

    start_dt = new Date(stock.st_sub_str);
    end_dt = new Date(stock.end_sub_str);
    
  }else if(stock.type === '수요예측'){

    start_dt = new Date(stock.st_forecast_dt_str);
    end_dt = new Date(stock.end_forecast_dt_str);

  }else{
    return (
      <span className='text-gray-500 text-sm font-bold'>
        {stock.type}
      </span>
    )
  }

  let start_dt_str = `${start_dt.getFullYear()}-${start_dt.getMonth()+1}-${start_dt.getDate()}(${day[start_dt.getDay()]})`;
  let end_dt_str = `${end_dt.getFullYear()}-${end_dt.getMonth()+1}-${end_dt.getDate()}(${day[end_dt.getDay()]})`;

  if(now_dt < start_dt){
    return (
      <>
        <span className='text-red-500 text-sm font-bold'>
          {`${stock.type} D-${calculateDday(start_dt)}`} 
        </span>
        <span className='text-black-500 text-xs font-semibold mx-2'>
          {`시작일 ${start_dt_str}`}
        </span>
      </>

    )
  }else if(now_dt >= start_dt && now_dt <= end_dt){
    return (
      <>
        <span className='text-red-500 text-sm font-bold'>{stock.type} 진행중</span>
        <span className='text-black-500 text-xs font-semibold mx-2'>{`마감일 ${end_dt_str}`}</span>
      </>
    )
  }

}

export default DdayMessage
