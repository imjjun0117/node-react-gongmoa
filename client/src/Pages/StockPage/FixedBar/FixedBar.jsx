import React, { useState } from 'react';
import { FaHome } from "react-icons/fa";
import { useSelector } from 'react-redux';

const FixedBar = ({menuType, menuTypeHandler}) => {

  const isAuth = useSelector(state => state.user?.isAuth);

  const handleMenuClick = (menu) => {
    menuTypeHandler(menu);
    // 여기에서 선택된 메뉴에 따른 동작 수행
  };
  return (
    <div className="flex justify-center items-center">
    <div className="flex border-b border-gray-700">
      
      <button
        className={`flex items-center h-10 px-2 py-2 -mb-px text-center ${
          menuType === ''
            ? 'text-indigo-600 border-b-2 border-indigo-500 hover:border-gray-400'
            : 'text-gray-700 border-b-2 border-transparent hover:border-gray-400'
        } sm:px-4 -px-1 whitespace-nowrap focus:outline-none`}
        onClick={() => handleMenuClick('')}
      >
      <FaHome />
      </button>

      <button
        className={`flex items-center h-10 px-2 py-2 -mb-px text-center ${
          menuType === 'today'
            ? 'text-indigo-600 border-b-2 border-indigo-500 hover:border-gray-400'
            : 'text-gray-700 border-b-2 border-transparent hover:border-gray-400'
        } sm:px-4 -px-1 whitespace-nowrap focus:outline-none`}
        onClick={() => handleMenuClick('today')}
      >
        <span className="mx-1 text-sm sm:text-base"> 오늘의 일정 </span>
      </button>

      <button
        className={`flex items-center h-10 px-2 py-2 -mb-px text-center ${
          menuType === 'forecast'
            ? 'text-indigo-600 border-b-2 border-indigo-500 hover:border-gray-400'
            : 'text-gray-700 border-b-2 border-transparent hover:border-gray-400'
        } sm:px-4 -px-1 whitespace-nowrap focus:outline-none`}
        onClick={() => handleMenuClick('forecast')}
      >
        <span className="mx-1 text-sm sm:text-base"> 수요예측 예정 </span>
      </button>

      <button
        className={`flex items-center h-10 px-2 py-2 -mb-px text-center ${
          menuType === 'sub'
            ? 'text-indigo-600 border-b-2 border-indigo-500 hover:border-gray-400'
            : 'text-gray-700 border-b-2 border-transparent hover:border-gray-400'
        } sm:px-4 -px-1 whitespace-nowrap focus:outline-none`}
        onClick={() => handleMenuClick('sub')}
      >
        <span className="mx-1 text-sm sm:text-base"> 청약 예정 </span>
      </button>
      {
        isAuth && 
        <button
          className={`flex items-center h-10 px-2 py-2 -mb-px text-center ${
            menuType === 'bookmark'
              ? 'text-indigo-600 border-b-2 border-indigo-500 hover:border-gray-400'
              : 'text-gray-700 border-b-2 border-transparent hover:border-gray-400'
          } sm:px-4 -px-1 whitespace-nowrap focus:outline-none`}
          onClick={() => handleMenuClick('bookmark')}
        >
          <span className="mx-1 text-sm sm:text-base"> 즐겨찾기 </span>
        </button>
      }
    </div>
  </div>
  );
};

export default FixedBar;