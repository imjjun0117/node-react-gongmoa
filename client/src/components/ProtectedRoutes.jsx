import React from 'react';
import { Outlet, Navigate } from 'react-router-dom'


const ProtectedRoutes = ({isAuth}) => {
  return (
    isAuth ? <Outlet/> : <Navigate to={'/login'}/>
  )
}

export default ProtectedRoutes
