import React, { useState } from 'react';

const NavItems = () => {
  const [ipoMenuVisible, setipoMenuVisible] = useState(false);
  const [comuMenuVisible, setComuMenuVisible] = useState(false);

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
        {ipoMenuVisible && (
          <div className="absolute mt-5 bg-white border border-gray-200 shadow-lg">
            <a href="/" className="block py-2 px-4 text-gray-900 hover:bg-gray-100">청약일정</a>
          </div>
        )}
      </li>
      <li>
        <a
          href="#"
          className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
          onClick={comuToggleMenu}
        >
          커뮤니티
        </a>
        {comuMenuVisible && (
          <div className="absolute mt-5 bg-white border border-gray-200 shadow-lg">
            <a href="#" className="block py-2 px-4 text-gray-900 hover:bg-gray-100">게시판</a>
          </div>
        )}
      </li>
      {/* Add more menu items here */}
    </ul>
  );
};

export default NavItems;
