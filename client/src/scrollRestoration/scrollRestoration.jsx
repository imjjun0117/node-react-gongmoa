import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
  const location = useLocation();
  const scrollPositions = useRef({});

  useLayoutEffect(() => {
    // 현재 스크롤 위치 저장
    scrollPositions.current[location.key] = window.scrollY;

    // 이전 페이지로 돌아갔을 때, 저장된 스크롤 위치로 복원
    const restoreScrollPosition = () => {
      if (scrollPositions.current[location.key] !== undefined) {
        window.scrollTo(0, scrollPositions.current[location.key]);
      }
    };

    restoreScrollPosition();
  }, [location]);
}

export default ScrollRestoration
