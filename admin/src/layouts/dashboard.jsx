import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import AdminMenuModify from '@/pages/dashboard/admin_menu/adminMenuModify';
import { AdminMenu, Home } from '@/pages/dashboard';
import { Profile } from '@/pages/dashboard';
import IpoList from '@/pages/dashboard/ipo_list/ipoList';
import IpoModify from '@/pages/dashboard/ipo_list/ipoModify';
import IpoLoad from '@/pages/dashboard/ipo_load/ipoLoad';
import UserMenu from '@/pages/dashboard/user_menu/userMenu';
import UserMenuModify from '@/pages/dashboard/user_menu/userMenuModify';
import UserList from '@/pages/dashboard/user_list/userList';
import UserModify from '@/pages/dashboard/user_list/userModify';
import SendEmail from '@/pages/dashboard/send_email/sendEmail';
import Main from '@/pages/dashboard/main';

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [routes, setRoutes] = useState([]);
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const navigate = useNavigate();

  useEffect(() => {

    //메뉴 사용여부 
    if(page){

      let body = {
        menu_path : `/${page}`
      }
  
      axiosInstance.post('/admin/admin_menu/isMenuValid', body).then(res => {
  
        if(!res.data.success){
          alert(res.data.msg);
          navigate('/');
        }
  
      })

    }

    fetchRoutes();

  }, [])
  
  const fetchRoutes = () => {
    
    //메뉴 로드
    axiosInstance.get('/admin/admin_menu/menu').then(res => {
  
      setRoutes(res.data.rtnMenu);

    })

  }


  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          // sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
          "/gongmoa.svg"
        }
        brandName='공모아 관리자'
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar routes={routes}/>
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          <Route exact path="/" element={<Main/>} />
          <Route path="/admin_menu">
            <Route index element={<AdminMenu fetchRoutes={fetchRoutes}/>}/>
            <Route path="/admin_menu/modify" element={<AdminMenuModify fetchRoutes={fetchRoutes}/>} />
          </Route>
          <Route path="/user_menu">
            <Route index element={<UserMenu/>}/>
            <Route path="/user_menu/modify" element={<UserMenuModify/>} />
          </Route>
          <Route path="/user_list">
            <Route index element={<UserList/>}/>
            <Route path="/user_list/modify" element={<UserModify/>} />
          </Route>
          <Route path="/ipo_list">
            <Route index element={<IpoList/>}/>
            <Route path="/ipo_list/modify" element={<IpoModify/>} />
          </Route>
          <Route path="/ipo_load">
            <Route index element={<IpoLoad/>}/>
          </Route>
          <Route path="/send_email">
            <Route index element={<SendEmail/>}/>
          </Route>
          <Route exact path="/tables" element={<Profile/>} />
          <Route exact path="/profile" element={<Profile/>} />
          <Route path="*" element={<Navigate to="/aoslwj7110" replace />} />
        </Routes>
        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
