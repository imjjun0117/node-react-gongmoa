import React, { useState, useEffect } from 'react';
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem
} from "@material-tailwind/react";
import axiosInstance from '../../../utils/axios';
import { NavLink } from 'react-router-dom';

const NavItems = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    if(!isLoading){
      setIsLoading(true);

      axiosInstance.get('/menu').then(res => {
        setMenuList(res.data.rtnMenu);
        setIsLoading(false);
      })

    }
    
  }, [])
  
  console.log(menuList);
  
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

  if(isLoading){
    return (
      <></>
    )
  }

  return (
    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
      {
        menuList.map(({title, path, pages}, idx) => (
          <li key={idx}>
            <Menu>
              {
                path === '#' ? (
                  <MenuHandler>
                    <button className='lock py-2 px-3 text-md rounded md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700 text-lg'>{title}</button>
                  </MenuHandler>
                ) : (
                <NavLink to={`${path}`}>
                  <MenuHandler>
                    <button className='lock py-2 px-3 text-md rounded md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700 text-lg'>{title}</button>
                  </MenuHandler>
                </NavLink>
                )
              }
              {
                pages.length !== 0 && (
                  <MenuList className='z-30 w-48 mt-2 p-3 hover:decoration-none'>
                    {pages.map(({name, path}, idx) => (
                      <>
                        <NavLink to={`${path}`}>
                          <MenuItem className='my-2'>{name}</MenuItem>
                        </NavLink>
                        <hr className="my-3" />
                      </>
                    ))}
                  </MenuList>
                )
              }
            </Menu>
          </li>
        ))
      }
  </ul>
  );
};

export default NavItems;
