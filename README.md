# 공모아 개발
![KakaoTalk_Photo_2024-03-17-18-08-09](https://github.com/imjjun0117/node-react-gongmoa/assets/84663172/f679985b-aefa-4c39-8f69-d4673005e3a7)



## 📙 프로젝트 개요
### 프로젝트 설명
- 주식 시장 공모주관련 일정, 상세 정보를 볼 수 있고 관심 종목에 대한 알림을 받을 수 있습니다
- 크롤링된 공모주 정보를 Client에게 전달 및 관리
    - 38커뮤니케이션 & 전자공시시스템(DART) 데이터를 직접 크롤링/가공 하여 사용


**배경**
- 최근 신규 상장한 공모주가 “따블”, “따따블”과 같이 폭등하며 개인투자자들 사이에서 큰 인기를 끌고 있습니다.
- 공모주 청약에 성공하기 위해서는 일정 관련 정보가 필수라 생각하여 좀 더 간편하게 이를 확인할 수 있는 서비스를 개발하였습니다.

### 🔗 배포 링크
<!-- - https://www.gongmoa.site -->

<br/>

### 💻 사용 도구

**백엔드**

- Express: `Nodejs v18.13.0`
- Server: `PM2`, `Nodemon`
- Library: `node-schedule`, `nodemailer`
- Database: `MySQL`
- Security: `jwt`
- API Document: `swagger-ui-express`, `swagger-autogen`

**프론트엔드**

- React:  `Vite`, `Redux`
- Server: `Nginx`
- Library: `react-redux`, `react-persist`, `react-toolkit`, `react-hook-form`
- etc: `Tailwind CSS`

**공모주 데이터 크롤링**

- 크롤러: `Cheerio 1.0.0`, `iconv`, `Mysql`

**ETC**

- DNS 세팅 : `가비아`
- SSL 인증서 : `certbot` 
- ServerComputer: `AWS EC2`, `Ubuntu Server 22.04 LTS`
- dev Tool: `SQLGate`, `putty`, `FileZilla` `Postman`, `Visual Studio Code`, `macOs`

<br/>

<br/><br/><br/>


## 📖 프로젝트 상세 정보
### 🛠 API 설계
![image](https://github.com/imjjun0117/node-react-gongmoa/assets/84663172/c7763670-04f7-42e9-a3b0-d8f7ad5a3058)

### 🛠 ERD
![image](https://github.com/imjjun0117/node-react-gongmoa/assets/84663172/e00c39b7-5b76-472b-a9b4-e7838a05537a)


<br/>

###  📱주요 기능
- 메인: URL 요청을 통해 공모주, 스펙주에 청약관련 정보를 확인할 수 있습니다.
  - Detail: 청약을 진행하는 주간사 정보와 최대 청약 개수를 확인할 수 있습니다.
  - Calendar: 지정된 기간에 청약, 환불, 상장 일정을 확인할 수 있고 로그인한 유저는 관심종목만 확인할 수 있습니다.
  - Notice: 매일 장이 시작되기 전에 관심종목에 관한 정보가 알림을 통해 전달됩니다.
- AUTH
  - 미들웨어 사용하여 사용자 권한(jwt) 유효성 확인합니다.
  - 카카오 OAuth로 로그인 및 신규가입합니다.
    
- 추후 커뮤니티, 보유 증권사 목록, 공모주 별점 등 기능 도입 예정입니다.
<!--   - SwaggerLink : http://server.dbsg.co.kr:8080/swagger-ui/index.html
![image](https://user-images.githubusercontent.com/10378777/223958261-832ce4fd-a0cb-4c4d-a88b-d1d50e4f14c7.png) -->

<br/>



### 🤔 고민한점
 - React SPA 특성상 리스트 페이지에서 새로고침, 뒤로 가기에서 페이지 검색 조건, 데이터 등이 유지가 되지 않는 문제가 발생
    - sessionStorage에 현재 데이터 값을 저장 후 새로고침, 뒤로 가기 이벤트 등을 직접 핸들링하며 조정
###💡배운점
- Redux의 구조와 동작 원리
  - Redux 및 Redux Toolkit을 사용하여 상태를 관리할 때 Redux의 구조와 동작 원리를 이해할 수 있습니다. 이를 통해 Redux의 개념을 확립하고, Redux를 효율적으로 사용할 수 있는 방법을 배울 수 있습니다.

- 컴포넌트 디자인 및 구조화 
 - React를 사용하여 컴포넌트를 디자인하고 구조화하는 방법을 배울 수 있습니다. Redux 및 Redux Toolkit을 통해 컴포넌트 간의 데이터 흐름을 관리하고, 컴포넌트를 재사용 가능하고 유지 보수가 용이하도록 구조화할 수 있습니다.

- 비동기 작업 처리 
 -  Redux 및 Redux Toolkit을 사용하여 비동기 작업을 처리하는 방법을 익힐 수 있습니다. 이를 통해 서버와의 데이터 통신이 필요한 경우 비동기 작업을 효율적으로 처리할 수 있습니다.

