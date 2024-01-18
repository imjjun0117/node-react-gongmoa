const express = require('express');
const app = express();
const path = require('path');
const db = require('./databases/config/mysql.js');
const cors = require('cors');
const schedule = require('node-schedule');
const ipoParsing = require('./databases/index.js');
const {setStSub, setEndSub, setStForecast, setEndForecast} = require('./databases/ipoNotify.js')
app.use(cors());
app.use(express.json());


//라우터 설정
app.use('/stocks', require('./routes/stocks'));
app.use('/users', require('./routes/users'));

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send(error.message || '서버에서 일시적인 오류가 발생했습니다.');
})

app.get('/', (req, res, next) => {

  res.send('hello');

})


const port = 8080;

app.listen(port, () => {
    console.log(`server start ${port}`);

    schedule.scheduleJob('00 35 18 * * *', () => {
      // console.log('실행')
      ipoParsing(1);

    })

    schedule.scheduleJob('00 32 16 * * *', () => {
      console.log('알림 보내는중...')
      setStSub();
      setEndSub();
      setStForecast();
      setEndForecast();
      console.log('끝...')

    })

})