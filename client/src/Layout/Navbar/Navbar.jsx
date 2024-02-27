import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import NavItems from './NavItems/NavItems';
import { MdOutlineLogin, MdOutlineLogout } from "react-icons/md";
import { FaChartLine } from 'react-icons/fa';
import styled from "styled-components";
import AccountItem from './NavItems/AccountItem';
import NoticeItem from './NavItems/NoticeItem';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuth = useSelector(state => state.user?.isAuth);

  const handleMenuToggle = () => {

    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <nav className="bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href='/' className="flex items-center space-x-3 rtl:space-x-reverse">
          <FaChartLine size={30} color="red" />
          <span className="self-center text-lg sm:text-lg md:text-2xl lg:text-2xl xl:text-3xl font-semibold whitespace-nowrap text-white">공모아</span>
        </a>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {
            !isAuth ? 
          <>
            <a
              href="/login"
              className="flex items-center py-2 px-1 text-white text-sm rounded md:bg-transparent md:text-white-700 md:p-0 md:dark:text-white-500 md:mr-5"
              aria-current="page"
            >
              <MdOutlineLogin />&nbsp;&nbsp;로그인/회원가입

            </a>
          </> : 
          <>
            <AccountItem />
            <NoticeItem/>
          </>}
        
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
            onClick={handleMenuToggle}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
          <NavItems/>
          {/* <DropdownMenu/> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
