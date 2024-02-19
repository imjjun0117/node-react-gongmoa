import { Routes, Route, Navigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import { component } from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import AdminMenuModify from '@/pages/dashboard/adminMenuModify';
import { AdminMenu, Home } from '@/pages/dashboard';
import { Profile } from '@/pages/dashboard';

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [routes, setRoutes] = useState([]);

  useEffect(() => {

    fetchRoutes();
    
  }, [])
  
  const fetchRoutes = () => {
    
    //메뉴 로드
    axiosInstance.get('/admin/menu').then(res => {
  
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
        <DashboardNavbar />
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
          <Route exact path="/" element={<Home/>} />
          <Route path="/admin_menu">
            <Route index element={<AdminMenu fetchRoutes={fetchRoutes}/>}/>
            <Route path="/admin_menu/modify" element={<AdminMenuModify/>} />
          </Route>
          <Route exact path="/tables" element={<Profile/>} />
          <Route exact path="/profile" element={<Profile/>} />
          <Route path="*" element={<Navigate to="/aoslwj7110" replace />} />
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
