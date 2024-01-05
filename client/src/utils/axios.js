//axiosInstance를 설정해주면서 인스턴스 처리를 해준다 => 중복된 경로를 최소화하기 위해서
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? 
    '' : import.meta.env.VITE_SERVER_URL
})

//accessToken 헤더 세팅
axiosInstance.interceptors.request.use(function(config){
  const accessToken = localStorage.getItem('accessToken');

  if(accessToken){
    config.headers.Authorization = 'Gongmoa_'+localStorage.getItem('accessToken');
  }
  

  return config;

}, function(err){
  return Promise.reject(err);
})

axiosInstance.interceptors.response.use(function(response){

  return response;

}, function(error){

  if(error.response.data == 'jwt expired'){ 
    // 토큰이 만료되었을 경우 에러 처리를 통해
    // 리로드하여 토큰을 userSlice에서 에러를 발생시켜 토큰을 지워준다.
    alert('로그인 엑세스가 만료되었습니다.')
    window.location.reload();

  }

  return Promise.reject(error)

})


export default axiosInstance;