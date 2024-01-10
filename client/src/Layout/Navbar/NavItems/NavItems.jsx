import React, { useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';

const NavItems = () => {
  const [ipoMenuVisible, setipoMenuVisible] = useState(false);
  const [comuMenuVisible, setComuMenuVisible] = useState(false);
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

  const ipoToggleMenu = () => {
    setipoMenuVisible(!ipoMenuVisible);
    setComuMenuVisible(false);
  };

  const comuToggleMenu = () => {
    setComuMenuVisible(!comuMenuVisible);
    setipoMenuVisible(false);
  }

  return (
    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <a
          href="#"
          className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          aria-current="page"
          onClick={ipoToggleMenu}
        >
          공모주
        </a>
        {ipoMenuVisible && isMobile &&(
          <div className={`sm:items-center sm:justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
            <a href="/" className="block px-4 py-2 text-gray-400 text-md hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700">&nbsp;청약일정</a>
            <a href="/stocks/calendar" className="block px-4 py-2 text-gray-400 text-md hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700">&nbsp;청약 캘린더</a>
          </div>
        )}
        {
          ipoMenuVisible && !isMobile &&(
            <div className="absolute mt-5 w-48 p-2 bg-gray-600 border border-gray-300 shadow-lg rounded-md hidden md:block">
            <a href="/" className="block px-4 py-2 text-white hover:bg-gray-700 transition duration-300 rounded-md">
              청약일정
            </a>
            <a href="/stocks/calendar" className="block px-4 py-2 text-white hover:bg-gray-700 transition duration-300 rounded-md">
              청약 캘린더
            </a>
          </div>
          )
        }
        {/* className="absolute mt-5 bg-white border border-gray-200 shadow-lg" */}
      </li>
      <li>
        <a
          href="#"
          className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          onClick={comuToggleMenu}
        >
          커뮤니티
        </a>
        {comuMenuVisible && isMobile && (
          <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
          <a href="/" className="block px-4 py-2 text-gray-400 text-md hover:bg-gray-100">&nbsp;청약일정</a>
          <hr/>
          <a href="/stocks/calendar" className="block px-4 py-2 text-gray-400 text-md hover:bg-gray-100">&nbsp;청약 캘린더</a>
        </div>
        )}
        {
          comuMenuVisible && !isMobile &&(
            <div className="absolute mt-5 w-48 p-2 bg-gray-600 border border-gray-300 shadow-lg rounded-md hidden md:block">
            <a href="/" className="block px-4 py-2 text-white hover:bg-gray-700 transition duration-300 rounded-md">
              청약일정
            </a>
            <a href="/stocks/calendar" className="block px-4 py-2 text-white hover:bg-gray-700 transition duration-300 rounded-md">
              청약 캘린더
            </a>
          </div>
          )
        }
      </li>
      {/* Add more menu items here */}
    </ul>
  );
};

export default NavItems;
