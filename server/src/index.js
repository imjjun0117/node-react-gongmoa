const express = require('express');
const app = express();
const path = require('path');
const db = require('./databases/config/mysql.js');
const cors = require('cors');
const schedule = require('node-schedule');
const ipoParsing = require('./databases/index.js');
const {setStSub, setEndSub, setStForecast, setEndForecast} = require('./databases/ipoNotify.js');

const dotenv = require('dotenv');
const { cleanEmailCode, sendNotify } = require('./email/email.js');
const {schedulerTime}  = require('./databases/ipoLoadConfig.js')

dotenv.config();
app.use(cors());
app.use(express.json());
let ipo_update_time = '00 00 00 * * *';

//라우터 설정
app.use('/stocks', require('./routes/user/stocks.js'));
app.use('/admin', require('./routes/admin/admin'));
app.use('/users', require('./routes/user/users.js'));

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send(error.message || '서버에서 일시적인 오류가 발생했습니다.');
})

app.get('/', async (req, res, next) => {

  res.send('hello');

})

app.get('/hihi', async(req, res, next) => {

  ipo_update_time = await schedulerTime();

  return res.json({
    success: true,
    msg: '성공'
  })

})

const port = 8080;

app.listen(port, async() => {
  
  try{
    ipo_update_time= await schedulerTime();

  }catch(err){
    console.error(err);
    ipo_update_time = '00 00 00 * * *';
  }


  console.log(`server start ${port} ${ipo_update_time}`);

    schedule.scheduleJob(ipo_update_time, () => {
      console.log('실행')
      ipoParsing(1);
      cleanEmailCode();
    })

    schedule.scheduleJob('00 50 08 * * *', () => {
      console.log('알림 보내는중...')
      setStSub();
      setEndSub();
      setStForecast();
      setEndForecast();
      console.log('끝...');
    })
    
    schedule.scheduleJob('00 00 09 * * *', () => {

      console.log('이메일 보내는중...');
      sendNotify();
      console.log('끝...');
    })
    
})