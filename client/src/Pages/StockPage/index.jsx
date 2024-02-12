import React, { useEffect, useState, useRef } from 'react';
import StockItems from './StockItems/StockItems';
import axiosInstance from '../../utils/axios';
import SearchForm from './SearchForm';
import FixedBar from './\bFixedBar/FixedBar';
import Loading from '../../Layout/Loading'
import { useSelector } from 'react-redux';

const Main = () => {
  const limit = 12;
  const [stocks, setStocks] = useState(JSON.parse(sessionStorage.getItem('reload'))  == 'Y' ? JSON.parse(sessionStorage.getItem('stocks')) : []);
  const [skip, setSkip] = useState(JSON.parse(sessionStorage.getItem('reload'))  == 'Y' ? JSON.parse(sessionStorage.getItem('skip')) : 0);
  const [keyword, setKeyword] = useState(JSON.parse(sessionStorage.getItem('reload'))  == 'Y' ? JSON.parse(sessionStorage.getItem('keyword')) : '');
  const [hasMore, setHasMore] = useState(JSON.parse(sessionStorage.getItem('reload'))  == 'Y' ? JSON.parse(sessionStorage.getItem('hasMore')) : true);
  const [initPage, setInitPage] = useState(JSON.parse(sessionStorage.getItem('reload'))  == 'Y' ? JSON.parse(sessionStorage.getItem('initPage')) : true); 
  const [menuType, setMenuType] = useState(JSON.parse(sessionStorage.getItem('reload'))  == 'Y' ? JSON.parse(sessionStorage.getItem('menuType')) : '');
  const loader = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const bookmark = useSelector(state => state.user?.userData.bookmark);

  useEffect(() => {
    //스크롤 위로 가기
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };

    const handleBeforeUnload = () => {
      //새로고침일 경우만
      if (performance.navigation.type === 1) {
        sessionStorage.setItem('reload', JSON.stringify('Y'));
      }
    };

    window.addEventListener('scroll', handleScroll);

    // 새로 고침 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handlePageHide = () => {
    //   //새로고침일 경우만 
      if (performance.navigation.type === 1) {
        sessionStorage.setItem('reload', JSON.stringify('Y'));
      }
    };
    
    // iOS Safari에서 페이지가 숨겨질 때(pagehide) 이벤트 리스너 등록
    window.addEventListener('pagehide', handlePageHide);


    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  //페이지 스크롤링
  const scrollPage = (position, behavior) => {
    window.scrollTo({ top: Number(position), behavior: behavior });
  };

  useEffect(() => {

      //새로고침, 뒤로가기 등 데이터 유지를 위한 세션 저장
      sessionStorage.setItem('stocks' , JSON.stringify(stocks));
      sessionStorage.setItem('skip', JSON.stringify(skip));
      sessionStorage.setItem('menuType', JSON.stringify(menuType));
      sessionStorage.setItem('keyword', JSON.stringify(keyword));
      sessionStorage.setItem('hasMore', JSON.stringify(hasMore));
      sessionStorage.setItem('initPage', JSON.stringify(initPage));
      sessionStorage.removeItem('reload');
      sessionStorage.removeItem('targetId');

  }, [stocks])

  //스크롤링을 위한 이벤트
  useEffect(() => {

    const options = {
      root: null, // 루트 요소. 기본값은 브라우저의 뷰포트
      rootMargin: '0px', // 루트와 타겟 요소 사이의 여백
      threshold: 0, // 타겟 요소의 가시성이 변경될 때 트리거되는 intersection ratio
    };
  
    // IntersectionObserver 인스턴스 생성
    const observer = new IntersectionObserver(handleObserver, options);

    // loader 요소가 존재하면 observer에 등록
    if (loader.current) {
      observer.observe(loader.current);
    }

    // 컴포넌트 언마운트 시, observer 해제
    return () => {
      observer.disconnect();
    };
  }, [loader, hasMore, initPage, skip]);

  const handleObserver = (entries) => {
    const target = entries[0];

    //initPage -> true인 경우 초기진입
    let rtnSkip = skip + limit;
    if(initPage) rtnSkip = 0;

    if (target.isIntersecting && hasMore) {

      fetchStockList({ skip: rtnSkip, limit, keyword, loadMore: initPage, menuType});

    }
  };

  //공모주 데이터 통신
  const fetchStockList = async ({ skip, limit, keyword, loadMore = true, menuType, setBookmark = bookmark }) => {

    let params = {
      skip,
      limit,
      keyword,
      menuType,
      setBookmark
    };


    try {
      const response = await axiosInstance.get('/stocks', { params });
      const newStocks = response.data;

      if (loadMore) {

        // 초기 진입 && 검색
        setStocks(newStocks);
        setSkip(0);
        setInitPage(false);

      } else {
        // 기존 데이터에 새로운 데이터를 추가
        setStocks((prevStocks) => [...prevStocks, ...newStocks]);
        setSkip(skip);
      }

      // 새로 받은 데이터의 길이가 limit 미만이면 데이터가 더 이상 없음
      if (newStocks.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (error) {
      console.error(error);
    }

  };

  //검색 핸들러
  const onSearchHandler = (input_keyword) => {

    setKeyword(input_keyword);
    fetchStockList({ skip : 0, limit, keyword: input_keyword, menuType });
  };

  //메뉴 핸들러
  const menuTypeHandler = (menuType) => {

    setMenuType(menuType);
    setKeyword('');
    fetchStockList({ skip : 0, limit, keyword: '', menuType: menuType });
    
  }
  
  return (
    <div className="mt-auto mx-auto w-full bg-gray-200 p-4 min-h-screen flex flex-col lg:items-center md:items-center">
      <div className="w-full md:max-w-md">
        <SearchForm onSearchHandler={(keyword) => onSearchHandler(keyword)} keyword = {keyword}/>
      </div>
      <div className='mb-5'>
        <FixedBar menuTypeHandler={(menuType) => menuTypeHandler(menuType)} menuType={menuType}/>
      </div>
      <div className={`grid gap-4 ${stocks?.length > 0 ? 'lg:grid-cols-2' : ''} lg:w-[1000px] sm:w-[600px] place-items-center`}>
        <StockItems stocks={stocks} keyword={keyword} menuType={menuType}/>
      </div>
      {showScrollButton && (
  <button
  onClick={() => {scrollPage(0, 'smooth')}}
  className="fixed w-12 sm:w-1/20 bottom-8 right-8 p-2 bg-gray-100 text-gray-800 text-bold cursor-pointer shadow-md hover:shadow-lg transition duration-300 rounded-md z-50"
  >
    ↑
  </button>
)}

      {hasMore && <div ref={loader}><Loading/></div>}
    </div>
  );
};

export default Main;