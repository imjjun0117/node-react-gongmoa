import React, { useState, useEffect } from 'react';
import {
  Collapse,
  Dropdown,
  initTE,
} from "tw-elements";

initTE({ Collapse, Dropdown });
const NavItems = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 예시의 임계값인 768은 모바일 여부를 판단하기 위한 임의의 값입니다.
    };

    // 컴포넌트가 처음 마운트될 때 이벤트 리스너 등록
    handleResize();

    // 창 크기가 변경될 때마다 이벤트 리스너 호출
    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  },[])

  return (

  <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
    <li>
      <a
        href="/"
        className="block py-2 px-3 rounded md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700"
        aria-current="page"
      >
        공모주 일정
      </a>

    </li>
    <li>
      <a
        href="/stocks/calendar"
        className="block py-2 px-3 rounded md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700"
      >
        공모주 캘린더
      </a>
    </li>
  </ul>

  );
};

export default NavItems;
