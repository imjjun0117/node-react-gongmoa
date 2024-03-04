import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Switch,
  Button,
  Input,
  Radio,
} from "@material-tailwind/react";
import { authorsTableData } from "@/data";
import { useEffect, useState } from 'react';
import DefaultPagination from '@/layouts/defaultPagination';
import axiosInstance from '@/utils/axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LoadingBar from '@/layouts/loadingBar';

export function IpoList() {

  const [searchParams, setSearchParams] = useSearchParams();
  const pp = searchParams.get('pp') ? searchParams.get('pp') : 10;
  const pg = searchParams.get('pg') ? searchParams.get('pg') : 1;
  const s_keyword = searchParams.get('keyword') ?  searchParams.get('keyword') : '';
  const s_type = searchParams.get('type') ?  searchParams.get('type') : '';
  const s_use_yn = searchParams.get('use_yn') ? searchParams.get('use_yn') : '';
  const s_stock_type = searchParams.get('stock_type') ? searchParams.get('stock_type') : '';
  const s_listed_type = searchParams.get('listed_type') ? searchParams.get('listed_type') : '';

  const [ipoList, setIpoList] = useState([]);
  const [totalRowNum, setTotalRowNum] = useState(0);
  const [dataStatus, setDataStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    fetchIpoList();

  }, [pg])
  
  const fetchIpoList = async() => {

    if(dataStatus){
      
      setDataStatus(false);

      let params = {
      
        pp,
        pg,
        keyword: s_keyword,
        type: s_type,
        use_yn: s_use_yn,
        stock_type: s_stock_type,
        listed_type: s_listed_type
        
      }
      
      //메뉴 리스트 호출
      await axiosInstance.get('/admin/ipo/ipoList', {params}).then(res => {
        
        setDataStatus(true);

        if(res.data.success){
  
          setIpoList(res.data.ipo_list);
          setTotalRowNum(res.data.totalRowNum);
        
  
        }else{
  
          alert(res.data.msg);
          navigate('/aoslwj7110');
  
        }
  
      })
    }


  }

  //메뉴 상태변경
  const setStatus = (e, ipo_id, type) => {

    let status = true;


    let body = {
      value : e.target.value === 'Y' ? 'N' : 'Y',
      ipo_id,
      type 
    }

    if(status){
      status = false;
      //상태변경 서버
      axiosInstance.post('/admin/ipo/setIpoStatus', body).then(async(res) => {
  
        alert(res.data.msg);
        status = true;
        if(res.data.success){
          fetchIpoList();
        }
  
      })

    }else{
      alert('처리중입니다.\n잠시만 기다려주세요.')
    }


  }

  const pagingFunction = (pg) => {

    const currentParams = { ...Object.fromEntries(searchParams) };

    // 새로운 값을 추가
    currentParams.pg = pg;

    // 업데이트된 search parameters를 URL에 반영
    setSearchParams(currentParams);

  }


  return (
    <div className="mt-48 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            공모주 관리
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form className='flex justify-center mb-2' method='get' action="./ipo_list">
              <table className="w-full text-xs text-left rtl:text-right text-gray-500 border border-gray-300 mx-5 my-2">
                <tbody>
                  <tr className="bg-white py-2">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      사용여부
                    </td>
                    <td>
                      <div className='w-2/3'>
                        <span>
                          <Radio
                            className="h-4 w-4"
                            name='use_yn'
                            value=""
                            defaultChecked={s_use_yn === ''}
                          />전체
                        </span>
                        <span className='ml-5'>
                          <Radio
                            className="h-4 w-4"
                            name='use_yn'
                            value="Y"
                            defaultChecked={s_use_yn === 'Y'}
                          />사용
                        </span>
                        <span className='ml-5'>
                          <Radio
                            className="h-4 w-4"
                            name='use_yn'
                            value="N"
                            defaultChecked={s_use_yn === 'N'}
                          />미사용
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white py-2">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      증권타입
                    </td>
                    <td>
                      <div className='w-2/3'>
                        <span>
                          <Radio
                            className="h-4 w-4"
                            name='stock_type'
                            value=""
                            defaultChecked={s_stock_type === ''}
                          />전체
                        </span>
                        <span className='ml-5'>
                          <Radio
                            className="h-4 w-4"
                            name='stock_type'
                            value="코스닥"
                            defaultChecked={s_stock_type === '코스닥'}
                          />코스닥
                        </span>
                        <span className='ml-5'>
                          <Radio
                            className="h-4 w-4"
                            name='stock_type'
                            value="코스피"
                            defaultChecked={s_stock_type === '코스피'}
                          />코스피
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white py-2">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                      진행상태
                    </td>
                    <td className="w-4/5">
                      <div className='w-2/3 mx-2'>
                        <div className='w-1/3'>
                        <select id="listed_type" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        name="listed_type">
                          <option value="" selected={s_listed_type === ""}>전체</option>
                          <option value="NL" selected={s_listed_type === "NL"}>신규상장</option>
                          <option value="PO" selected={s_listed_type === "PO"}>공모예정</option>
                        </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white py-2">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                      검색타입
                    </td>
                    <td className="w-4/5">
                      <div className='w-2/3 mx-2'>
                        <div className='w-1/3'>
                        <select id="type" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        name="type">
                          <option value="" selected={s_type === ""}>전체</option>
                          <option value="corp_nm" selected={s_type === "corp_nm"}>주식명</option>
                          <option value="weekly_company" selected={s_type === "weekly_company"}>증권사</option>
                          <option value="stock_code" selected={s_type === "stock_code"}>종목코드</option>
                        </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white py-2">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      검색어
                    </td>
                    <td className="">
                      <div className='w-2/3 mx-2 flex justify-between'>
                        <div className='w-2/3'>
                          <Input name="keyword" defaultValue={s_keyword}/>
                        </div>
                        <div className='w-1/3 ml-2'>
                          <Button type="submit">검색</Button>
                        </div>
                      </div>                      
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[ "증권타입", "종목코드", "주식명", "진행상태", "증권사", "청약 시작일", "청약 마감일", "등록일", "수정일", "사용여부", "업데이트 사용여부"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>   
              {ipoList.map(
                ({ corp_nm, st_sub, end_sub, weekly_company, ipo_id, stock_type, stock_code, listed_type,
                  reg_dt, update_dt, use_yn, update_yn }, key) => {
                  const className = `py-3 px-5 ${
                    key === authorsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={key} className={`${use_yn === 'Y' ? '' : 'bg-gray-200'}`}>
                    
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Link to={`/aoslwj7110/ipo_list/modify?ipo_id=${ipo_id}&act=U&pp=${pp}&pg=${pg}&keyword=${s_keyword}&type=${s_type}&use_yn=${s_use_yn}&stock_type=${s_stock_type}&listed_type=${s_listed_type}`}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`text-xs font-semibold text-blue-gray-600 cursor-pointer hover:underline`}
                              >
                                {stock_type}
                              </Typography>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Link to={`/aoslwj7110/ipo_list/modify?ipo_id=${ipo_id}&act=U&pp=${pp}&pg=${pg}&keyword=${s_keyword}&type=${s_type}&use_yn=${s_use_yn}&stock_type=${s_stock_type}&listed_type=${s_listed_type}`}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`text-xs font-semibold text-blue-gray-600 cursor-pointer hover:underline`}
                              >
                                {stock_code}
                              </Typography>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Link to={`/aoslwj7110/ipo_list/modify?ipo_id=${ipo_id}&act=U&pp=${pp}&pg=${pg}&keyword=${s_keyword}&type=${s_type}&use_yn=${s_use_yn}&stock_type=${s_stock_type}&listed_type=${s_listed_type}`}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`text-xs font-semibold text-blue-gray-600 cursor-pointer hover:underline`}
                              >
                                {corp_nm}
                              </Typography>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Link to={`/aoslwj7110/ipo_list/modify?ipo_id=${ipo_id}&act=U&pp=${pp}&pg=${pg}&keyword=${s_keyword}&type=${s_type}&use_yn=${s_use_yn}&stock_type=${s_stock_type}&listed_type=${s_listed_type}`}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`text-xs font-semibold text-blue-gray-600 cursor-pointer hover:underline`}
                              >
                                {listed_type === 'PO' ? '공모예정' : '신규상장'}
                              </Typography>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Link to={`/aoslwj7110/ipo_list/modify?ipo_id=${ipo_id}&act=U&pp=${pp}&pg=${pg}&keyword=${s_keyword}&type=${s_type}&use_yn=${s_use_yn}&stock_type=${s_stock_type}&listed_type=${s_listed_type}`}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`text-xs font-semibold text-blue-gray-600 cursor-pointer hover:underline`}
                              >
                                {weekly_company}
                              </Typography>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className={`text-xs font-semibold text-blue-gray-600`}
                            >
                              {st_sub}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className={`text-xs font-semibold text-blue-gray-600`}
                            >
                              {end_sub}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {reg_dt}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {update_dt ? update_dt : '-'}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Switch
                          value={use_yn}
                          checked={use_yn === 'Y'}
                          onClick={(e) => {setStatus(e, ipo_id, 'use_yn')}}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                      </td>
                      
                      <td className={className}>
                        <Switch
                          value={update_yn}
                          checked={update_yn === 'Y'}
                          onClick={(e) => {setStatus(e, ipo_id, 'update_yn')}}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                      </td>
                      
              
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
          {
            !dataStatus && (
  
                  <div className='flex justify-center w-full my-10'>
                    <span>
                      <LoadingBar/>
                    </span>
                  </div>
                
            )
          }
          {dataStatus && ipoList.length === 0 && (
            <span className='flex justify-center mt-5 font-semibold text-gray-400 text-sm'>
              해당하는 공모주가 존재하지 않습니다.
            </span>
          )} 
          <div className='flex justify-end mt-5 mr-8'>
            <Link to={`/aoslwj7110/ipo_load`}>
              <Button size="md" className='mr-4'>
                  공모주 불러오기 설정
              </Button>
            </Link>
            <Link to={`/aoslwj7110/ipo_list/modify?act=I&pp=${pp}&pg=${pg}&keyword=${s_keyword}&type=${s_type}&use_yn=${s_use_yn}&stock_type=${s_stock_type}&listed_type=${s_listed_type}`}>
              <Button size="md" color="blue">
                  등록
              </Button>
            </Link>
          </div>
          <div className='flex items-center justify-center mt-5'>
          <DefaultPagination prn_Per_cnt={pp} currentPage={pg} totalRowNum={totalRowNum} pagingFunction={pagingFunction}/>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
export default IpoList;

