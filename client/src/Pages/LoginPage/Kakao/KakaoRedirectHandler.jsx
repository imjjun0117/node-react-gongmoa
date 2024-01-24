import React from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { kakaoLogin } from '../../../action/userAction';
import axios from 'axios';


//kakao 로그인 관련하여 callback 처리를 하는 로직
const KakaoRedirectHandler = () => {

  const params= new URL(document.location.toString()).searchParams;
  const code = params.get('code');
  console.log(code,'-----------');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    axios.post(`https://kauth.kakao.com/oauth/token`, {
      grant_type: 'authorization_code',
      client_id : import.meta.env.VITE_REST_API_KEY,
      redirect_uri : import.meta.env.VITE_REDIRECT_URI,
      code: code
    },
    {
      headers :{"Content-type" : "application/x-www-form-urlencoded;charset=utf-8"}
    }).then((res) => {
      
      const {access_token} = res.data;
  
      axios.post(
      `https://kapi.kakao.com/v2/user/me`,
      {},
      {
          headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
              }
          }
      )
      .then((res) => {

        const userData = res.data;
      
        let body = 
        {
          userData : userData
        }

        dispatch(kakaoLogin(body)).then(res => {
          
          localStorage.setItem('kakaoToken', access_token);

          if(res.payload.newUser){
            navigate('/kakao/addTel');
          }else if(res.payload.kakaoLoginSuccess){
            navigate('/');
          }

        });

      })
  
    })

  },[])

  return (
    <div>
      
    </div>
  )
}

export default KakaoRedirectHandler
