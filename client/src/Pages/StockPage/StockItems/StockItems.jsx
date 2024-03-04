import React, { useEffect } from 'react';
import { addComma,setTagColor } from '../../../utils/jsUtils';
import DdayMessage from './DdayMessage';
import { Link } from 'react-router-dom';
import Bookmark from '../../../Layout/Bookmark/Bookmark';

const StockItems = ({stocks}) => {
  const targetId = JSON.parse(sessionStorage.getItem('targetId')) || '';

  useEffect( ()=> {

    if(JSON.parse(sessionStorage.getItem('reload')) === 'Y' && targetId){

      const targetDiv = document.getElementById(targetId);
      
      if(targetDiv){
        targetDiv.scrollTop = 100;
  
        targetDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

      }
    }
    
  },[stocks])

  if( (stocks?.length < 1) ){

    return (
      <span className='text-black mt-24'>해당하는 공모주가 존재하지 않습니다.</span>
    )
  }

  return (
    <>
      {stocks.map((stock, index) => (
        <div className="relative max-w-md w-full" key={index} id={stock.ipo_id} >

          {/* 수요예측과 공모참여일자 */}
          <div className="top-0 left-0 px-2 py-1 z-10">
            <DdayMessage stock={stock}/>
          </div>

          {/* 카드 */}
          <div className="bg-white shadow-md rounded-md overflow-hidden transform transition-transform hover:scale-105 relative z-10">
            {/* 카드 헤더 */}
            <div className="flex justify-between items-center py-2 px-4 text-white" style={{ marginBottom: '-6px' }}>
              {/* 종목 타입 태그 */}
              <div className="flex space-x-2">
                <div className={`text-sm ${stock.stock_type.trim() === '코스닥' ? 'bg-blue-700' : stock.stock_type.trim() === '거래소' ? 'bg-green-700' : 'bg-red-700'} px-2 py-1`}>{stock.stock_type}</div>  
              </div>
              <Bookmark id={stock.ipo_id}/>
            </div>
            {/* 카드 본문 */}
            <div className="py-2 px-4">
              {/* 종목명 */}
              <div className="text-2xl font-semibold mb-2 hover:text-blue-500" style={{cursor:'pointer'}}><Link to={`/stocks/${stock.ipo_id}`}>{stock.corp_nm}</Link></div>
              {/* 공모밴드 */}
              <div className="text-sm text-gray-600 mb-2">
                <span>희망공모가: {addComma(stock.st_hope_price)} ~ {addComma(stock.end_hope_price)}원</span>
                {!!stock.confirmed_price && <span className='ml-3 text-red-500'>확정공모가 : {addComma(stock.confirmed_price)}원</span>}
              </div>
              {/* 증권사 태그 */}
              <div className='space-x-1'>
                {stock.weekly_company && stock.weekly_company.split(',').map((weekly_company, index) => (
                  <div key={index}
                  className=
                  {`inline-block ${setTagColor(weekly_company)} border px-2 py-1 rounded-full font-bold mb-2 text-xs`}>
                    {weekly_company}
                  </div>
                ))}
                </div>
              </div>
            </div>
        </div>
      ))
    }

    </>
  );
};

export default StockItems;
