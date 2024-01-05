import React from 'react'
import kakaoSymbol from '../../../images/sns_login_k.png';

const KakaoBtn = () => {
  const REST_API_KEY = `${import.meta.env.VITE_REST_API_KEY}`;
  const REDIRECT_URI = `${import.meta.env.VITE_REDIRECT_URI}`
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const kakaoLoginHandler = () => {

    window.location.href = link;
    
  };

  return (
  
    <button
    className="w-full flex items-center justify-center text-[rgba(0,0,0,0.85)] bg-yellow-400 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    onClick={() => kakaoLoginHandler()}
    >
      <img src={kakaoSymbol} alt="Kakao 로그인" className="w-3 h-3 mr-2" />
      카카오 로그인
    </button>
  );

}

export default KakaoBtn
