import React from 'react';
import { Outlet, Navigate } from 'react-router-dom'


const CheckPwdRoutes = ({isCheckedPwd}) => {
  return (
    isCheckedPwd ? <Outlet/> : <Navigate to={'/users/checkPwd'}/>
  )
}

export default CheckPwdRoutes
