const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const outputFile = path.join(__dirname, './swagger_output.json');
const endpointsFiles = [path.join(__dirname, './routes/admin/*.js'),path.join(__dirname, './routes/user/*.js')]; // 라우터 파일 경로

const doc = {
  info: {
    title: '공모아 API 문서',
    description: '공모아 서버 API관련 문서입니다.',
  },
  host: 'localhost:8080', // API 서버의 호스트
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./index.js') // Express 애플리케이션 시작
});
