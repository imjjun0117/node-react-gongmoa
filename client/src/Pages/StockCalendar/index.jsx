import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // FaCheckCircle 추가
import styled from 'styled-components';
import axiosInstance from '../../utils/axios';
import Loading from '../../Layout/Loading';
import EventModal from './StockEventModal/StockEventModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

const ToggleButton = ({ onClick, isToggled, label, color }) => {
  return (
    <ToggleBtn onClick={onClick}  color={color}>
      {isToggled ? <FaCheckCircle style={{ color: color }} /> : <FaTimesCircle style={{ color: '#ddd' }} />}
      <span>{label}</span>
    </ToggleBtn>
  );
};


const StockCalendar = () => {
  const [events, setEvents] = useState([]); // 캘린더 날짜 표시
  const [strDate, setStrDate] = useState(''); //캘린더 표시 날짜 start
  const [endDate, setEndDate] = useState(''); //캘린던 표시 날짜 end
  const [subToggle, setSubToggle] = useState(true); //공모일자 토글 온오프
  const [refundToggle, setRefundToggle] = useState(true); //환불일 토글 온오프
  const [listToggle, setListToggle] = useState(true); //상장일 토글 온오프
  const [modalIsOpen, setModalIsOpen] = useState(false); //모달 오픈
  const [selectedEvent, setSelectedEvent] = useState(null); //온클릭시 오픈 이벤트(모달용)
  const bookmark = useSelector(state => state.user?.userData.bookmark); // 즐겨찾기 목록
  const [bookmarkFlag, setBookmarkFlag] = useState(false); // 즐겨찾기 토글

  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event._def);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const subToggleHandler = () => {
    setSubToggle((prev) => !prev);
  };

  const refundToggleHandler = () => {
    setRefundToggle((prev) => !prev);
  };

  const listToggleHandler = () => {
    setListToggle((prev) => !prev);
  };

  //호버관련 이벤트
  const handleEventMouseEnter = (arg) => {
    const eventElement = arg.el;
    eventElement.style.transform = 'scale(1.05)'; 
    eventElement.style.cursor = 'pointer'; 
  };
  
  const handleEventMouseLeave = (arg) => {
    const eventElement = arg.el;
    eventElement.style.transform = ''; 
    eventElement.style.cursor = ''; 
  }
  //호버관련 이벤트

  //캘린더 날짜 변경시 실행 핸들러
  const handleDatesSet = (arg) => {
    setStrDate(arg.startStr);
    setEndDate(arg.endStr);
  };

  const fetchStock = async ({ str_dt, end_dt, type }) => {
    let params = {
      str_dt,
      end_dt,
      type
    };

    try {
      const response = await axiosInstance.get('/stocks/calendar', { params });

      const stocks = response.data.stocks;

      const convertedEvents = stocks.map((stock) => ({
        id: stock.ipo_id,
        title: `${bookmark.indexOf(Number(stock.ipo_id)) !== -1 ? `★${stock.corp_nm}` : stock.corp_nm}`,
        start: type === 'S' ? stock.st_sub_str : type === 'R' ? stock.refund_dt_str : stock.list_dt_str,
        end: type === 'S' ? stock.end_sub_str : type === 'R' ? stock.refund_dt_str : stock.list_dt_str,
        color: type === 'S' ? '#ED0000' :type === 'R' ? '#FFBB00' : '#0054FF',
      }));

      return convertedEvents;

    } catch (error) {
      alert('일시적인 오류가 발생했습니다.\n잠시후 다시 시도해주세요.');
    }
  };

  async function eventSet() {
    if (strDate && endDate) {
      let rtn_events = [];

      setEvents([])
      if (subToggle) {
        console.log('-----subToggle')
        const subEvents = await fetchStock({ str_dt: strDate, end_dt: endDate, type: 'S' });
        rtn_events = rtn_events.concat(subEvents);
      }
      if (refundToggle) {
        console.log('-----refund')
        const refundEvents = await fetchStock({ str_dt: strDate, end_dt: endDate, type: 'R' });
        rtn_events = rtn_events.concat(refundEvents);
      }
      if (listToggle) {
        console.log('-----listToggle')
        const listEvents = await fetchStock({ str_dt: strDate, end_dt: endDate, type: 'L' });
        rtn_events = rtn_events.concat(listEvents);
      }

      console.log('Returned Events:', rtn_events);
     
      setEvents(rtn_events);
    }
  }

  useEffect(() => {
    
    eventSet();   

  }, [strDate, endDate, subToggle, refundToggle, listToggle]);

  if (!events) {
    return (
      <Loading />
    );
  }

  return (
    <div className='mt-5 mb-5 mx-auto max-w-4xl px-3 py-3'>
      <div className='flex justify-between'>
        <ToggleWrapper>
          <ToggleButton
            onClick={subToggleHandler}
            isToggled={subToggle}
            label="청약"
            color="#ED0000"
          />
          <ToggleButton
            onClick={refundToggleHandler}
            isToggled={refundToggle}
            label="환불"
            color="#FFBB00"
          />
          <ToggleButton
            onClick={listToggleHandler}
            isToggled={listToggle}
            label="상장"
            color="#0054FF"
          />
        </ToggleWrapper>
        <span className={`${bookmarkFlag ? 'text-yellow-400' : 'text-gray-300'} hover:cursor-pointer hover:text-yellow-600`}>
          <FontAwesomeIcon icon={faStar} size="sm" /> <span className='text-black text-sm'>즐겨찾기</span>
        </span>
      </div>
      <StyledFullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        locales={[koLocale]}
        locale="ko"
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
        datesSet={handleDatesSet}
        contentHeight="100px"
        eventClick={handleEventClick}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
      />
      <EventModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        event={selectedEvent}
      />
    </div>
  );
};

const ToggleWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const ToggleBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  span {
    font-size: 14px;
  }

  svg {
    font-size: 18px;
  }
}`;


const StyledFullCalendar = styled(FullCalendar)`
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

export default StockCalendar;
