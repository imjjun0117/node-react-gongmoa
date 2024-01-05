import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const NotAuthRoutes = ({isAuth}) => {
  
  return (
      isAuth ? <Navigate to={'/'}/> : <Outlet/>
  )
}

export default NotAuthRoutes
