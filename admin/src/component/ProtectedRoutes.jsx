import React from 'react';
import { Outlet, Navigate } from 'react-router-dom'


const ProtectedRoutes = ({isAdmin}) => {
  return (
    isAdmin ? <Outlet/> : <Navigate to={'/aoslwj7110/auth/login'}/>
  )
}

export default ProtectedRoutes
