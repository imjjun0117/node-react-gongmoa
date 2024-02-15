import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const NotAuthRoutes = ({isAdmin}) => {
  
  return (
    isAdmin ? <Navigate to={'/aoslwj7110'}/> : <Outlet/>
  )
}

export default NotAuthRoutes
