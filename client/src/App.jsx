import { Outlet, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Layout/Navbar/Navbar';
import Footer from './Layout/Footer/Footer';
import StockPage from './Pages/StockPage';
import StockDetail from './Pages/StockDetail';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import ProtectedRoutes from './components/ProtectedRoutes';
import NotAuthRoutes from './components/NotAuthRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { authUser } from './action/userAction';
import KakaoRedirectHandler from './Pages/LoginPage/Kakao/KakaoRedirectHandler';
import StockCalendar from './Pages/StockCalendar';
import CheckPassword from './Pages/AccountPage/CheckPassword/CheckPassword';
import AccountPage from './Pages/AccountPage/index';
import FindPassword from './Pages/FindPassword/index';
import UpdatePassword from './Pages/FindPassword/UpdatePassword/UpdatePassword';
import KakaoAddInfo from './Pages/LoginPage/Kakao/KakaoAddInfo';

import ReactGA from 'react-ga4';

function Layout() {
  return (
    <div className='flex flex-col h-screen justify-between'>
    <ToastContainer 
        position='bottom-right'
        theme='light'
        pauseOnHover
        autoClose={1500}
      />
      <header className='mb-12'>
        <Navbar/>
      </header>
      <main>
        <Outlet/>
      </main>
      <footer>
        <Footer/>
      </footer>

    </div>
  );
}

function App(){

  const isAuth = useSelector(state => state.user?.isAuth);
  const {pathname} = useLocation();
  const dispatch = useDispatch();

  const GA_ID = import.meta.env.VITE_GA_TRACKING_ID;
  const[initialized, setInitialLized] = useState(false);

  useEffect(() => {

    //구글 애널리틱스 초기화
    if(GA_ID){
      ReactGA.initialize(GA_ID);
      setInitialLized(true);
    }
    
  },[]);

  useEffect(() => {
  
    if(isAuth){
      dispatch(authUser());
    }

    console.log(pathname);
    
    if(initialized){
      ReactGA.set({ page: pathname });
      ReactGA.send("pageview");
    }

  },[isAuth, pathname, dispatch, initialized])

  // ScrollRestoration();

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<StockPage/>}/>
        <Route path="/stocks/:stockId" element={<StockDetail/>}/>
        <Route path="/stocks/calendar" element={<StockCalendar/>}/>
        <Route element={<ProtectedRoutes isAuth={isAuth}/>}>
          {/* 로그인한 사람만 갈 수 있는 경로 */}
          <Route path="/kakao/addInfo" element={<KakaoAddInfo/>}/>
          <Route path="/users/checkPwd" element={<CheckPassword/>}/>
          <Route path="/users/account" element={<AccountPage/>}/>
        </Route>

        {/* 로그인한 사람은 갈 수 없는 경로 */}
        <Route element={<NotAuthRoutes isAuth={isAuth}/>}>
          <Route path="login" element={<LoginPage/>}/>
          <Route path="register" element={<RegisterPage/>}/>
          <Route path="kakao/callback" element={<KakaoRedirectHandler/>}/>
          <Route path="users/findPwd" element={<FindPassword/>}/>
          <Route path="users/updatePwd" element={<UpdatePassword/>}/>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App;
