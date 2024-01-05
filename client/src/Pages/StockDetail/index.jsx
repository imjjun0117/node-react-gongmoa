import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { addComma } from '../../utils/jsUtils';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import Loading from '../../Layout/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { bookMark } from '../../action/userAction';

const StockDetail = () => {

  const isAuth = useSelector(state => state.user?.isAuth);
  const id = useParams().stockId;
  const [stockDetail , setStockDetail] = useState(null);
  const [demandList, setDemandList] = useState([]);
  const [bookmark, setBookmark] = useState([]);
  const [flag, setFlag] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //상세 정보 불러오기
  async function fetchStock(){
    try{
      const response = await axiosInstance.get(`/stocks/${id}`);
      if(response.data.success){
        //공모주 정보
        setStockDetail(response.data.stockDetail);
        //공모주 수요예측 정보
        setDemandList(response.data.demandList);
      }else{
        alert(response.data.message);
        navigate('/');
      }

    }catch(error){
      alert('일시적인 에러가 발생했습니다.\n잠시후 다시 시도해주세요.');
      console.log(error);
    }//end catch
  }

  //즐겨찾기 불러오기
  async function fetchBookmark(){

    const response = await axiosInstance.get(`/users/bookmark`);
    setBookmark(response.data.bookmark);

  }

  //즐겨찾기 핸들러
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

    
  },[])
  
  useEffect(() => {
    
    fetchStock();
    
  },[id]);


  if(!stockDetail){
    return (
      <Loading/>
    );
  }

  //수요예측 총합 계산
  let totalCnt = 0 ;
  if(demandList.length > 0){
    demandList.map(demand => {
      totalCnt += demand.count;
    })
  }


  return (
    
    <div className="flex justify-center items-center bg-gray-200 min-h-screen py-10 px-5">
      <div className="w-full max-w-md">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold flex-grow mb-3">
            {stockDetail.corp_nm}
          </h2>
          {/* 즐겨찾기 별 아이콘 */}
          <span className={`${bookmark.indexOf(Number(id)) === -1 ? 'text-gray-300' : 'text-yellow-400'} file:cursor-pointer hover:text-yellow-600 flex-shrink-0 ml-2`} onClick={() => bookMarkHandler(id)}>
            <FontAwesomeIcon icon={faStar} size="lg" />
          </span>
        </div>
        <div className="bg-white shadow-md rounded-md overflow-hidden transform transition-transform relative z-10">
          <div className="py-2 px-4 mt-3">
            <div className="text-xl font-semibold mb-2">기업정보</div>
            <div className="border-t border-gray-300 my-3"></div>
            <table className="text-sm text-gray-600 mb-2">
              <tbody>
                <tr>
                  <td className="font-semibold text-gray-400 w-[120px;]">업종</td>
                  <td>{stockDetail.sector || '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">시장구분</td>
                  <td>{stockDetail.stock_type || '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">종목코드</td>
                  <td>{stockDetail.stock_code || '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">대표자</td>
                  <td>{stockDetail.corp_rep || '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">최대주주</td>
                  <td>{stockDetail.largest_share_holder|| '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">기업구분</td>
                  <td>{stockDetail.corp_type || '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">소재지</td>
                  <td>{stockDetail.corp_addr || '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">홈페이지</td>
                  <td><a className="text-blue-500 hover:underline" href={stockDetail.corp_hp ? `https://${stockDetail.corp_hp}` : ''} target={stockDetail.corp_hp ? `_blank` : ''}>{stockDetail.corp_hp || '-'}</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-md overflow-hidden transform transition-transform relative z-10 mt-10">
          <div className="py-2 px-4 mt-3">
            <div className="text-xl font-semibold mb-2">공모가</div>
            <div className="border-t border-gray-300 my-3"></div>
            <table className="text-sm text-gray-600 mb-2">
              <tbody>
                <tr>
                  <td className="font-semibold text-gray-400 w-[120px;]">희망공모가</td>
                  <td>{addComma(stockDetail.st_hope_price)} ~ {addComma(stockDetail.end_hope_price)}원</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">확정공모가</td>
                  <td>{!!stockDetail.confirmed_price && <span className='text-red-600'>{addComma(stockDetail.confirmed_price)}원</span> || '미정'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-md overflow-hidden transform transition-transform relative z-10 mt-10">
          <div className="py-2 px-4 mt-3">
            <div className="text-xl font-semibold mb-2">공모스케줄 / 경쟁률</div>
            <div className="border-t border-gray-300 my-3"></div>
            <table className="text-sm text-gray-600 mb-2">
              <tbody>
                <tr>
                  <td className="font-semibold text-gray-400 w-[120px;]">수요예측일</td>
                  { stockDetail.st_forecast_dt_str && <td>{stockDetail.st_forecast_dt_str} ~ {stockDetail.end_forecast_dt_str}</td> ||<td>미정</td> }
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">청약일</td>
                  { stockDetail.st_sub_str && <td>{stockDetail.st_sub_str} ~ {stockDetail.end_sub_str}</td> ||<td>미정</td> }
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">환불일</td>
                  <td>{stockDetail.refund_dt_str || '미정'}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-400">상장일</td>
                  <td>{stockDetail.list_dt_str || '미정'}</td>
                </tr>
              </tbody>
            </table>
            <div className="border-t border-gray-300 my-3"></div>
            <table className="text-sm text-gray-600 mb-2">
              <tbody>
                <tr>
                  <td className="font-semibold text-gray-400 w-[120px;]">청약경쟁률</td>
                  {stockDetail.comp_ratio || '-'}
                </tr>                
              </tbody>
            </table>
          </div>
        </div>

        {
        demandList.length > 0 &&
        <div className="bg-white shadow-md rounded-md overflow-hidden transform transition-transform relative z-10 mt-10">
          <div className="py-2 px-4 mt-3">
            <div className="text-xl font-semibold mb-2">수요예측 신청가격 분포</div>
            <div className="border-t border-gray-300 my-3"></div>
            <table className="text-sm text-gray-600 mb-2">
              <tbody>
                {
                  demandList.map((demand, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold text-gray-400 w-[250px;]">{demand.price}</td>
                      <td>{!!demand.count ? `${demand.count}건` : '-'}</td>
                    </tr>

                  ))
                }
                <tr>
                  <td className="font-semibold text-gray-400">합계</td>
                  <td>{totalCnt}건</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        }
        
        
      </div>
    </div>
  );
};

export default StockDetail;
