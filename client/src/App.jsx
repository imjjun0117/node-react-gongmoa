import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
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
import { useEffect } from 'react';
import { authUser } from './action/userAction';
import KakaoRedirectHandler from './Pages/LoginPage/Kakao/KakaoRedirectHandler';
import KakaoHtelAdd from './Pages/LoginPage/Kakao/KakaoHtelAdd';
import StockCalendar from './Pages/StockCalendar';
import CheckPassword from './Pages/AccountPage/CheckPassword/CheckPassword';
import AccountPage from './Pages/AccountPage/index';

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
  const isCheckedPwd = useSelector(state => state.user?.isCheckedPwd);
  const {pathname} = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
  
    if(isAuth){
      dispatch(authUser());
    }

  },[isAuth, pathname, dispatch])

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<StockPage/>}/>
        <Route path="/stocks/:stockId" element={<StockDetail/>}/>
        <Route path="/stocks/calendar" element={<StockCalendar/>}/>
        <Route element={<ProtectedRoutes isAuth={isAuth}/>}>
          {/* 로그인한 사람만 갈 수 있는 경로 */}
          <Route path="/kakao/addTel" element={<KakaoHtelAdd/>}/>
          <Route path="/users/checkPwd" element={<CheckPassword/>}/>
          <Route path="/users/account" element={<AccountPage/>}/>
        </Route>

        {/* 로그인한 사람은 갈 수 없는 경로 */}
        <Route element={<NotAuthRoutes isAuth={isAuth}/>}>
          <Route path="login" element={<LoginPage/>}/>
          <Route path="register" element={<RegisterPage/>}/>
          <Route path="kakao/callback" element={<KakaoRedirectHandler/>}/>
        </Route>
      </Route>


    </Routes>
  )
}

export default App;
