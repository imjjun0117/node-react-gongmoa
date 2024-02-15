import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoutes from './component/ProtectedRoutes';
import NotAuthRoutes from './component/NotAuthRoutes';
import { authAdmin } from './action/adminAction';

function App() {

  const isAdmin = useSelector(state => state.admin?.userData?.admin_yn) === 'Y';
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authAdmin());
  },[isAdmin])

  return (
    <Routes>
      <Route element={<ProtectedRoutes isAdmin={isAdmin}/>}>
        <Route path="/aoslwj7110/*" element={<Dashboard />} />
      </Route>
      <Route element={<NotAuthRoutes isAdmin={isAdmin}/>}>
        <Route path="/aoslwj7110/auth/*" element={<Auth />} />
      </Route>
      <Route path="*" element={<Navigate to="/aoslwj7110" replace />} />
    </Routes>
  );
}

export default App;
