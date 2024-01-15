import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import NavItems from './NavItems/NavItems';
import { FaBell } from "react-icons/fa";
import { MdOutlineLogin, MdOutlineLogout, MdPersonAdd } from "react-icons/md";
import { logoutUser } from '../../action/userAction';
import { FaChartLine } from 'react-icons/fa';
import { VscAccount } from "react-icons/vsc";
import styled, { css } from "styled-components";
import { IoIosSettings } from "react-icons/io";
// import {DropdownMenu} from './NavItems/DropdownMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuth = useSelector(state => state.user?.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [acctMenu, setAcctMenu] = useState(false);
  const [alertMenu, setAlertMenu] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAcctMenu = () => {
    setAcctMenu(!acctMenu);
    setAlertMenu(false);
  }

  const handleAlertMenu = () => {
    setAcctMenu(false);
    setAlertMenu(!alertMenu);
  }

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
        <Link to={'/'}className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" /> */}
          <FaChartLine size={30} color="red" />

          <span className="self-center text-lg sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-semibold whitespace-nowrap dark:text-white">공모아</span>
        </Link>

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
          {/* <button className='flex items-center text-white mr-10' onClick={onLogoutHandler}><MdOutlineLogout />&nbsp;&nbsp;로그아웃</button> */}
          <button className='flex items-center text-white mr-5 text-2xl' onClick={handleAcctMenu}><VscAccount /></button>

          {acctMenu && (
            <AccountMenu>
              <a href="/users/checkPwd" className="px-4 py-2 text-sm flex items-center text-white hover:bg-gray-700 transition duration-300 rounded-md">
              <IoIosSettings />&nbsp;&nbsp;계정설정
              </a>
              <hr className="my-2 border-t border-gray-300 opacity-50" />

              <a href="#" onClick={onLogoutHandler} className="px-4 py-2 text-sm flex items-center text-white hover:bg-gray-700 transition duration-300 rounded-md">
              <MdOutlineLogout/>&nbsp;&nbsp;로그아웃
              </a>
            </AccountMenu>
            
          )} 
            <button onClick={handleAlertMenu}>
              <span className='absolute top-3 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 rounded-full'>
                    2
              </span>
              <FaBell style={{ color: 'white', fontSize: '24px' }}/>
            </button>
          {alertMenu && (
            <AlertMenu>
              <span className="text-white px-2 py-2 text-lg mb-2 flex items-center"><FaBell style={{ color: 'white', fontSize: '12px' }}/>&nbsp;알림</span>
              <a href="/users/account" className="px-4 py-2 text-sm flex items-center text-white hover:bg-gray-700 transition duration-300 rounded-md">
              회원님이 즐겨찾기 하신 포스뱅크의 정보가 업데이트 됐습니다. 12분전
              </a>
              <hr className="my-2 border-t border-gray-300 opacity-50" />

              <a href="#" onClick={onLogoutHandler} className="px-4 py-2 text-sm flex items-center text-white-100 hover:bg-gray-700 transition duration-300 rounded-md">
              회원님의 게시글에 댓글이 남겨졌습니다. 18분전
              </a>
            </AlertMenu>  
          )} 
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
const AccountMenu = styled.div`
  position: absolute;
  top: 100%;
  transform: translateX(-50%);
  width: 10rem;
  padding: 0.5rem;
  margin-top: 10px;
  background-color: #4a5568;
  color: white;
  border-radius: 0.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: -20px;
    left: 57%;
    transform: translateX(-50%);
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #4a5568 transparent;
  }

  .dropdown-link {
    display: block;
    padding: 0.5rem;
    text-decoration: none;
    color: white;
    transition: background-color 0.3s;

    &:hover {
      background-color: #2d3748;
    }
  }
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
`;

const AlertMenu = styled.div`
  position: absolute;
  top: 100%;
  transform: translateX(-50%);
  width: 18rem;
  left: 87.5%;
  padding: 0.5rem;
  margin-top: 10px;
  background-color: #4a5568;
  color: white;
  border-radius: 0.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: "";
    position: absolute;
    top: -20px;
    left: 91%;
    transform: translateX(-50%);
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #4a5568 transparent;
  }

  .dropdown-link {
    display: block;
    padding: 0.5rem;
    text-decoration: none;
    color: white;
    transition: background-color 0.3s;

    &:hover {
      background-color: #2d3748;
    }
  }
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
`;


export default Navbar;
