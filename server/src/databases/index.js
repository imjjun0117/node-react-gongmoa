const axios = require('axios');
const fs = require('fs');
const AdmZip = require('adm-zip');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const db = require('./config/mysql.js');
const parseString = require('xml2js').parseString;
const {replaceTxt} = require('../utils/jsUtils.js');


let parseData = async () => {

  try {
    
    const response = await axios.get('https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=fb83f49c6ec2e48004c7e8baedafde1197c0bd18', {
      responseType: 'arraybuffer', // 바이너리 데이터로 받음
    });
    
    let fileName = `CORPCODE.zip`;
    
    fs.writeFileSync(fileName, response.data);
    
    // 압축 해제
    const zip = new AdmZip(fileName);
    zip.extractAllTo('extracted', true);
    
    // 파일 읽기
    fs.readFile('extracted/CORPCODE.xml', 'utf-8', (err, data) => {

      if (err) {
        console.error(err);
        return;
      }

      // XML 파싱
      parseString(data, (parseErr, corp_list) => {
        if (parseErr) {
          console.error(parseErr);
          return;
        }

      //DB delete all
      db.query('DELETE FROM corp_list', (delete_error, delete_result) => {
        
        if(delete_error){
          console.log(`corp_list delete error : ${delete_error}, query: DELETE FROM corp_list`);
          return false;
        }
        
        let dataToInsert = [];
  
        // 파싱된 DB에 밀어넣기
        corp_list?.result?.list?.map(corp => {
  
          dataToInsert.push(
            [
            corp.corp_code[0], 
            corp.corp_name[0], 
            corp.stock_code[0], 
            corp.modify_date[0]
            ]
          );
  
        });
  
        let insertQuery = `
          INSERT INTO 
          corp_list (
            corp_code,
            corp_name,
            stock_code,
            modify_date
          ) 
          VALUES 
          ?
        `;
        
        //DB insert
        db.query(insertQuery, [dataToInsert], (err, result) => {
  
          if(err){
            console.log(err);
            return false;
          }//end if
  
          console.log(result);
  
        });     

      })
      
      });
    });

  } catch (error) {
    console.error('에러 발생:', error.message);
  }
}


//상세페이지 html 불러오기
const getIPODetailHTML = async (ipoId) => {

  try{

    return await axios.get(`https://www.38.co.kr/html/fund/?o=v&no=${ipoId}`, {responseType: 'arraybuffer'});

  }catch(error){
    console.log(`IPO Detail Page Error: ${error}`);
  }

}//getIPODetailHTML


//ipo 상세 정보 파싱 후 DB 추가
const parsingIPODetail = (ipoIdArr) => {

  ipoIdArr.map(async ipoId => {

    const html = await getIPODetailHTML(ipoId);
    const content = iconv.decode(html.data, "EUC-KR").toString()
    const $ = cheerio.load(content);
    const $corp = $("table[summary='기업개요'] tbody tr"); //기업 정보 테이블
  
    let dataArr = [];
    dataArr.push(ipoId);
  
    $corp.each((idx, node) => {
      
      if(idx === 0){
  
        //기업명
        dataArr.push(replaceTxt($(node).find('td:eq(1) font').html()));
  
        //진행상황
        let type = replaceTxt($(node).find('td:eq(3)').html());
        if(type === '신규상장') dataArr.push('NL'); // 신규상장일 경우 타입
        else if(type === '공모주') dataArr.push('PO') //공모진행일 경우 타입
        else dataArr.push('N') // 그외 나머지 타입
  
      }else if(idx === 1){
  
        //시장구분
        dataArr.push(replaceTxt($(node).find('td:eq(1)').html()));
        
        //종목코드
        dataArr.push(replaceTxt($(node).find('td:eq(3)').html()));
  
      }else if(idx === 2){
  
        //업종
        dataArr.push(replaceTxt($(node).find('td:eq(1)').html()));
  
      }else if(idx === 3){
  
        //대표자
        dataArr.push(replaceTxt($(node).find('td:eq(1)').html()));
        
        //기업구분
        dataArr.push(replaceTxt($(node).find('td:eq(3)').html()));
  
      }else if(idx === 4){
  
        //기업구분
        dataArr.push(replaceTxt($(node).find('td:eq(1)').html()));
  
      }else if(idx === 5){
  
        //기업 홈페이지 주소
        dataArr.push(replaceTxt($(node).find('td:eq(1) a').html()));
  
        //전화번호
        dataArr.push(replaceTxt($(node).find('td:eq(3)').html()));
  
      }else if(idx === 6){
      
        //최대주주 & 지분
        dataArr.push(replaceTxt($(node).find('td:eq(1)').html()));
  
      }//end else
  
    })
  
    let selectQuery = 
    `
      SELECT * 
      FROM corp_info
      WHERE ipo_id = ?
    
    `
  
    db.query(selectQuery, ipoId, (selectErr, corp) => {
  
      //기업 테이블에 존재하는지 조회
      if(selectErr){
        console.error(`corp_info 조회 중 에러발생 : ${selectErr}`);
        return false;
      }
  
      if(corp[0]){
        //존재한다면 데이터 수정
        
        dataArr.push(ipoId);
  
        let updateQuery = 
        `
          UPDATE corp_info
          SET
            ipo_id = ?,
            corp_nm = ?,
            listed_type = ?,
            stock_type = ?,
            stock_code = ?,
            sector = ?,
            corp_rep = ?,
            corp_type = ?,
            corp_addr = ?,
            corp_hp = ?,
            corp_tel = ?,
            largest_share_holder = ?,
            update_dt = SYSDATE()
          WHERE
            ipo_id = ?
        `
  
        db.query(updateQuery, dataArr, (updateErr, result) => {
  
          if(updateErr){
            console.error(`corp_info(id:${ipoId}) 업데이트 중 에러발생 : ${updateErr}`)
            return false;
          }
  
        })
  
      }else{
        //존재하지 않으면 데이터 추가
        let insertQuery = 
        `
          INSERT INTO 
            corp_info
              (
                ipo_id,
                corp_nm,
                listed_type,
                stock_type,
                stock_code,
                sector,
                corp_rep,
                corp_type,
                corp_addr,
                corp_hp,
                corp_tel,
                largest_share_holder,
                reg_dt
              )
            VALUES
            (
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              ?,
              NOW()
            )
        `
      
        db.query(insertQuery, dataArr, (insertErr, result) => {
          if(insertErr){
            console.error(`corp_info(id:${ipoId}) 추가 중 에러발생 : ${insertErr}`);
            return false;
          }
      
        })
  
      }//end else
  
    })

    let infoArr = []; //공모주 정보 업데이트를 위한 데이터

    //공모 정보 들고오기
    const $info = $("table[summary='공모정보'] tbody tr");
    $info.each((idx, node) => {

      if(idx === 0){

        infoArr.push(replaceTxt($(node).find('td:eq(1)').html()).replaceAll(',','').replaceAll('주', '' ).trim()); // 총공모주식수
        infoArr.push(replaceTxt($(node).find('td:eq(3)').html()).replaceAll(',','').replaceAll('원', '' ).trim()); // 액면가

      }

    })

    const $schedule = $("table[summary='공모청약일정'] tbody tr");

    $schedule.each((idx, node) => {

      if(idx === 0){
        //수요예측일
        let date = replaceTxt($(node).find('td:eq(2)').html()).split('~');
        infoArr.push(date[0].trim());
        infoArr.push(date[1].trim());
      }

      if(idx === 2){
        //배정공고일
        infoArr.push(replaceTxt($(node).find('td:eq(1)').html()).split('(')[0].trim());
      }

      if(idx === 3){
        //납입일
        infoArr.push(replaceTxt($(node).find('td:eq(1)').html()));
      }
      
      if(idx === 4){
        //환불일
        infoArr.push(replaceTxt($(node).find('td:eq(1)').html()));
      }

      if(idx === 5){
        //상장일
        let list_dt = replaceTxt($(node).find('td:eq(1)').html());
        infoArr.push( list_dt === '' ? null : list_dt); // 공백 처리
      }

    })

    infoArr.push(ipoId);

    let updateIPO = 
    `
      UPDATE ipo
      SET
        total_stock = ?,
        face_price = ?,
        st_forecast_dt = ?,
        end_forecast_dt = ?,
        assign_dt = ?,
        payment_dt = ?,
        refund_dt = ?,
        list_dt = ?
      WHERE
        ipo_id = ?
    `;

    db.query(updateIPO, infoArr , (updateErr, result) => {

      if(updateErr) {
        console.log(`IPO 날짜 업데이트 중 에러발생: ${updateErr}`);
        return false;
      }

    })


    //수요예측 데이터 적재 로직
    const $demand_img = $("table tbody tr td img[alt='수요예측 신청가격분포']");

    if($demand_img.html() !== null){

      //수요예측 테이블을 특정할 수 없어서 수요예측 이미지가 있으면 해당 테이블 다음 테이블을 불러온다
      const $demand = $demand_img.closest('table').next('table').find('tbody tr');

      let deleteQuery = 
      `
        DELETE 
        FROM
          ipo_demand_forecast
        WHERE
          ipo_id = ?
      `;

      db.query(deleteQuery, [ipoId], (deleteErr, result) => {

        if(deleteErr){

          console.error(`수요예측 테이블 적재 중 DELETE ERROR : ${deleteErr}`);
          return false;

        }//end if
        
        let demandArr = [];

        //해당 수요예측 삭제
        $demand.each((demand_idx, node) => {

          if(demand_idx !== 0 && replaceTxt($(node).find("td:eq(0)").html()) !== '합계'){

            demandArr.push([
              ipoId,
              replaceTxt($(node).find("td:eq(0)").html()),
              replaceTxt($(node).find("td:eq(1)").html()) === '-' ? '0' : replaceTxt($(node).find("td:eq(1)").html())
            ]);

          }
  
        });

        let insertDemandQuery = 
        `
          INSERT 
          INTO
            ipo_demand_forecast
            (
              ipo_id,
              price,
              count
            )
          VALUES
            ?
        `;

        db.query(insertDemandQuery, [demandArr], (insertErr, result) => {

          if(insertErr){
            console.error(`수요예측 테이블 적재 중 INSERT ERROR : ${insertErr}`);
            return false;
          }

        })


      });



    }

  })
  
  console.log('corp detail 페이지 데이터 적재 완료');

}


const getIPOHTML = async (pageNo) => {
  
  try{

    return await axios.get(`https://www.38.co.kr/html/fund/index.htm?o=k&page=${pageNo}`,{responseType: 'arraybuffer'});

  }catch(error){
    console.log(error);
  }
}

const ipoParsing = async (pageNo) => {

  const html = await getIPOHTML(pageNo);
  const content = iconv.decode(html.data, "EUC-KR").toString()
  const $ = cheerio.load(content);
  const $row = $("table[summary='공모주 청약일정']");

  const $headers = $row.find('tbody tr');
  
  let ipoIdArr = []; //디테일 페이지 정보를 업데이트하기 위해 id값을 배열에 담는다.

  $headers.each((idx, node_header) => {
    
    let $td = $(node_header).find("td");
    let array = []; //데이터 처리를 위한 배열

    let corp_name = '';
    $td.each((_idx, node_td) => {
      
      //테이블 컬럼마다 인덱스로 분기처리한다.
      let td = $(node_td).html().trim();
      
      if(_idx !== 6){

        if(_idx === 0){

          //a 태그 종목 id값을 추출해온다
          let detailUrlParam = new URLSearchParams("https://domain.net" + $(node_td).find('a').attr('href'));
          array.push(detailUrlParam.get('no').trim());
          ipoIdArr.push(detailUrlParam.get('no').trim());

          //제목 파싱
          corp_name = $(node_td).find('a font').html();
          array.push(corp_name);
          return true;

        }

        if(_idx === 1){
          
          //청약 시작일 ~ 청약 마감일 파싱
          let [start, end]  = td.split('~');
          array.push(start);
          array.push(`${start.split('.')[0]}.${end}`);
          return true;

        } 
        
        if(_idx === 2){

          //확정 공모가 
          let price = td === '-' ? '0' : td;          
          array.push(price.replaceAll(',',''));
          return true;

        }

        if(_idx === 3){

          //희망 공모밴드
          let [start, end] = td.split('~');

          array.push(start.replaceAll(',',''));
          array.push(end.replaceAll(',',''));

          return true;
        }
        
        if(_idx === 4){

          //청약 경쟁률
          array.push(td);
          return true;

        } 
        
        if(_idx === 5){

          //주간사
          array.push(td);
          return true;

        }

      }
    })

    let selectQuery = 
    `
      SELECT *
      FROM ipo
      WHERE ipo_id = ?
    `;

    db.query(selectQuery, [array[0]], (err, ipo) => {

      if(err) {
        console.log(err);
        return false;
      }//end if

      if(ipo[0]){
        
        let updateQuery =
        `
        UPDATE 
        ipo
        SET
          ipo_id = ?,
          corp_nm = ?,
          st_sub = ?,
          end_sub = ?,
          confirmed_price = ?,
          st_hope_price = ?,
          end_hope_price = ?,
          comp_ratio = ?,
          weekly_company = ?
        WHERE
          corp_nm = ?   
        `;

        if(corp_name.indexOf('(') !== -1){
          array.push(corp_name.slice(0, corp_name.indexOf('(')));
        }else{
          array.push(array[0]);
        }
        array.push(array[0]);

        db.query(updateQuery, array, (err2, result) => {
          
          if(err2){
            console.log(err2);
            return false;
          }//end if

        })

      
      }else{

        let insertQuery =
        `
        INSERT INTO
        ipo(
          ipo_id,
          corp_nm,
          st_sub,
          end_sub,
          confirmed_price,
          st_hope_price,
          end_hope_price,
          comp_ratio,
          weekly_company
        )
        VALUES(
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        
        `;

        db.query(insertQuery, array, (err2, result) => {
          
          if(err2){
            console.log(err2);
            return false;
          }//end if

        })

      }

    });


  })

  parsingIPODetail(ipoIdArr);

}


ipoParsing(1);