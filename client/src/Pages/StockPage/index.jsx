import React, { useEffect, useState, useRef } from 'react';
import StockItems from './StockItems/StockItems';
import axiosInstance from '../../utils/axios';
import SearchForm from './SearchForm';
import FixedBar from './\bFixedBar/FixedBar';

const Main = () => {
  const limit = 12;
  const [stocks, setStocks] = useState([]);
  const [skip, setSkip] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [initPage, setInitPage] = useState(true); 
  const [menuType, setMenuType] = useState('');
  const loader = useRef(null);

  useEffect(() => {
    const options = {
      root: null, // 루트 요소. 기본값은 브라우저의 뷰포트
      rootMargin: '0px', // 루트와 타겟 요소 사이의 여백
      threshold: 0.5, // 타겟 요소의 가시성이 변경될 때 트리거되는 intersection ratio
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
  }, [loader, hasMore, skip, initPage]);

  const handleObserver = (entries) => {
    const target = entries[0];

    //initPage -> true인 경우 초기진입
    let rtnSkip = skip + limit;
    if(initPage) rtnSkip = 0;
    
    if (target.isIntersecting && hasMore) {

      fetchStockList({ skip: rtnSkip, limit, keyword, loadMore: initPage, menuType});

    }
  };

  const fetchStockList = async ({ skip, limit, keyword, loadMore = true, menuType }) => {

    let params = {
      skip,
      limit,
      keyword,
      menuType
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

  const onSearchHandler = (input_keyword) => {
    setKeyword(input_keyword);
    fetchStockList({ skip : 0, limit, keyword: input_keyword, menuType });
  };

  //일정 메뉴 
  const menuTypeHandler = (menuType) => {

    setMenuType(menuType);
    setKeyword('');
    fetchStockList({ skip : 0, limit, keyword: '', menuType: menuType });
    
  }
  
  return (
    <div className="mt-auto mx-auto w-full bg-gray-200 p-4 min-h-screen flex flex-col lg:items-center md:items-center">
      <div className="w-full max-w-md">
        <SearchForm onSearchHandler={(keyword) => onSearchHandler(keyword)} keyword = {keyword}/>
      </div>
      <div className='mb-5'>
        <FixedBar menuTypeHandler={(menuType) => menuTypeHandler(menuType)} menuType={menuType}/>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 lg:w-[1000px] sm:w-[600px] place-items-center">
        <StockItems stocks={stocks} />
      </div>
      {hasMore && <div ref={loader}>Loading...</div>}
    </div>
  );
};

export default Main;
