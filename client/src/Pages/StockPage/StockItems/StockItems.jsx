import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { addComma,setTagColor } from '../../../utils/jsUtils';
import DdayMessage from './DdayMessage';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookMark } from '../../../action/userAction';
import axiosInstance from '../../../utils/axios';

const StockItems = ({stocks}) => {
  const isAuth = useSelector(state => state.user?.isAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bookmark, setBookmark] = useState([]);
  const [flag, setFlag] = useState(true);

  const fetchBookmark = async () => {
  
    const response = await axiosInstance.get(`/users/bookmark`);
    setBookmark(response.data.bookmark);

  }

  const bookMarkHandler = (id) => {
    
    if(flag){

      setFlag(false);

      if(!isAuth){
        if(window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')){
          navigate('/login');
        }
        return false;
      }//end if
  
      
      let body = {
        id: id  
      };

      dispatch(bookMark(body)).then(() => {
        setFlag(true);
        fetchBookmark();
      });

    }else{
      alert('진행중입니다. 잠시만 기다려주세요.');
    }
  
  }

  useEffect(() => {
    
    if(isAuth) {
      
      fetchBookmark();
    }
  }, [dispatch])

  return (
    <>
      {stocks.map((stock, index) => (
        <div className="relative max-w-md w-full" key={index}>

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
              {/* 즐겨찾기 별 */}
              <div className={`${bookmark.indexOf(stock.ipo_id) === -1 ? 'text-gray-300' : 'text-yellow-400'} cursor-pointer hover:text-yellow-600`} onClick={() => bookMarkHandler(stock.ipo_id)}>
                <FontAwesomeIcon icon={faStar} />
              </div>
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
