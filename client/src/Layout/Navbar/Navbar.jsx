import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NavItems from './NavItems/NavItems';
import { FaBell } from "react-icons/fa";
import { MdOutlineLogin, MdOutlineLogout, MdPersonAdd } from "react-icons/md";
import { logoutUser } from '../../action/userAction';
import { FaChartLine } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuth = useSelector(state => state.user?.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onLogoutHandler = () => {

    if(!window.confirm('정말로 로그아웃을 하시겠습니까?')){
      return false;
    }

    try{
      dispatch(logoutUser()).then(() => {
        navigate('/');
      });
    }catch(error){
      alert('일시적인 오류가 발생했습니다.\n잠시후 다시 시도해주세요.')
      console.log(error);
    }
    
  }

  return (
    <nav className="bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" /> */}
          <FaChartLine size={30} color="red" />

          <span className="self-center text-lg sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-semibold whitespace-nowrap dark:text-white">공모아</span>
        </a>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {
            !isAuth ? 
          <>
            <a
              href="/login"
              className="flex items-center py-2 px-1 text-white rounded md:bg-transparent md:text-white-700 md:p-0 md:dark:text-white-500 md:mr-5"
              aria-current="page"
            >
              <MdOutlineLogin />&nbsp;&nbsp;로그인
            </a>
            <a
              href="/register"
              className="flex items-center py-2 px-1 text-white rounded md:bg-transparent md:text-white-700 md:p-0 md:dark:text-white-500 md:mr-5"
              aria-current="page"
            >
              <MdPersonAdd />&nbsp;&nbsp;회원가입
            </a>
          </> : 
          <>
            <button className='flex items-center text-white mr-10' onClick={onLogoutHandler}><MdOutlineLogout />&nbsp;&nbsp;로그아웃</button>
            <button>
              <span className='absolute top-3 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 rounded-full'>
                    0
              </span>
              <FaBell style={{ color: 'white', fontSize: '24px' }}/>
            </button>
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
