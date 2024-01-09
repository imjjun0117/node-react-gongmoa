import React, {useState} from 'react';
import Modal from 'react-modal';
import axiosInstance from '../../../utils/axios';
import { addComma } from '../../../utils/jsUtils';
import Bookmark from '../../../Layout/Bookmark/Bookmark';
import Loading from '../../../Layout/Loading';

const customStyles = {
  overlay:{
    position: 'fixed',
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:'rgba(255, 255, 255, 0)',
    zIndex:10,
  },
  content: {
    display:'flex',
    flexDirection: 'column',
    backgroundColor: 'rgb(229 231 235)',
    top: '20vh',
    bottom: '20vh',
    WebkitOverflowScrolling: 'scroll',
    outline: 'none',
    borderRadius: '10px',
    zIndex: 10,
    padding: '30px',
    overflow: 'auto',
    margin: 'auto',
  },
};

Modal.setAppElement('#root');

const EventModal = ({ isOpen, closeModal, event }) => {

  const [stockDetail, setStockDetail] = useState(null);
  const [demandList, setDemandList] = useState([]);

  if(isOpen && !stockDetail){ 
    //state가 변경될떄마다 모달이 실행되어 무한루프 => stockDetail이 null일때만 실행되게 하고 closemodal시 state초기화

    axiosInstance.get(`/stocks/${event.publicId}`).then(res => {
      console.log(res.data);

      if(res.data.success){
        setStockDetail(res.data.stockDetail);
         //공모주 수요예측 정보
        setDemandList(res.data.demandList);
      }else{
        alert(res.data.message);
        closeModal();
      }
    })


  }
  //수요예측 총합 계산
  let totalCnt = 0 ;
  if(demandList.length > 0){
    demandList.map(demand => {
      totalCnt += demand.count;
    })
  }
  // 모바일 디바이스 여부를 확인 (모달 폭 조정)
  const isMobile = window.innerWidth <= 1200;

  // 동적 스타일링
  const dynamicStyles = {
    overlay: {
      ...customStyles.overlay
    },
    content: {
      ...customStyles.content, // 기존 스타일 유지
      left: isMobile ? '10vw' : '40vw',
      right: isMobile ? '10vw' : '40vw',
    },
  };

  const onCloseHandler = () => {
    setStockDetail(null);
    closeModal();
  }

  if(!stockDetail){
    return (
      <></>
    )
  }

  return (
    <div id='root'>

    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Event Modal"
      style={dynamicStyles}
    >
        <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={onCloseHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
        </button>
        <div className="flex items-center mb-3">
          <h2 className="text-3xl font-bold flex-grow mr-2">
            {stockDetail.corp_nm}
          </h2>
          <Bookmark id={stockDetail.ipo_id} />
        </div>
        <div className="bg-white shadow-md rounded-md transform transition-transform relative z-10">
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
        <div className="bg-white shadow-md rounded-md transform transition-transform relative z-10 mt-10">
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
        <div className="bg-white shadow-md rounded-md transform transition-transform relative z-10 mt-10">
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
                  <td>{stockDetail.comp_ratio || '-'}</td>
                </tr>                
              </tbody>
            </table>
          </div>
        </div>
        {
        demandList.length > 0 &&
        <div className="bg-white shadow-md rounded-md transform transition-transform relative z-10 mt-10">
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
    </Modal>
    </div>
  );
};


export default EventModal;