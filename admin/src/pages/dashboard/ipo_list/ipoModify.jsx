import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Radio,
  Input
} from "@material-tailwind/react";
import axiosInstance from '@/utils/axios';
import { useEffect, useState } from 'react';
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import LoadingBar from '@/layouts/loadingBar';

export function IpoModify({fetchRoutes}) {

  const [searchParams] = useSearchParams();
  const ipoId = searchParams.get('ipo_id');
  const act = searchParams.get('act');
  const [targetCode, setTargetCode] = useState('');
  const navigate = useNavigate();
  const [ipoDetail, setIpoDetail] = useState({});
  const pp = searchParams.get('pp') ? searchParams.get('pp') : 10;
  const pg = searchParams.get('pg') ? searchParams.get('pg') : 1;
  const s_keyword = searchParams.get('keyword') ?  searchParams.get('keyword') : '';
  const s_type = searchParams.get('type') ?  searchParams.get('type') : '';
  const s_use_yn = searchParams.get('use_yn') ? searchParams.get('use_yn') : '';
  const s_stock_type = searchParams.get('stock_type') ? searchParams.get('stock_type') : '';
  const s_listed_type = searchParams.get('listed_type') ? searchParams.get('listed_type') : '';
  const [dataStatus, setDataStatus] = useState(true);
  
  useEffect(() => {

    if(dataStatus){

      setDataStatus(false);

      if(act === "U"){
  
          if(!ipoId){
            alert('잘못된 접근입니다.');
            navigate(`/aoslwj7110/ipo_list?pp=${pp}&pg=${pg}&keyword=${s_keyword}&type=${s_type}&use_yn=${s_use_yn}&stock_type=${s_stock_type}&listed_type=${s_listed_type}`)
          }
      
          let params = {
            ipoId
          }
      
          axiosInstance.get('/admin/ipo/getIpoDetail', {params}).then(res => {
      
            if(res.data.success){
      
              setIpoDetail(res.data.ipoDetail);
      
              reset({
  
                corp_nm: ipoDetail.corp_nm,
                st_sub: ipoDetail.st_sub,
                end_sub: ipoDetail.end_sub,
                confirmed_price:  ipoDetail.confirmed_price,
                st_hope_price:  ipoDetail.st_hope_price,
                end_hope_price:  ipoDetail.end_hope_price,
                comp_ratio: ipoDetail.comp_ratio,
                weekly_company: ipoDetail.weekly_company,
                total_stock: ipoDetail.total_stock,
                face_price: ipoDetail.face_price,
                st_forecast_dt: ipoDetail.st_forecast_dt,
                end_forecast_dt: ipoDetail.end_forecast_dt,
                payment_dt: ipoDetail.payment_dt ,
                refund_dt: ipoDetail.refund_dt,
                list_dt: ipoDetail.list_dt ,
                assign_dt: ipoDetail.assign_dt ,
                stock_code: ipoDetail.stock_code,
                sector: ipoDetail.sector,
                corp_rep: ipoDetail.corp_rep,
                corp_type: ipoDetail.corp_type,
                corp_addr: ipoDetail.corp_addr,
                corp_hp: ipoDetail.corp_hp ,
                corp_tel: ipoDetail.corp_tel,
                largest_share_holder: ipoDetail.largest_share_holder,
              
              })
  
              setDataStatus(true);

            }else{
              alert(res.data.msg);
              navigate(`/aoslwj7110/ipo_list?pp=${pp}&pg=${pg}&keyword=${s_keyword}&type=${s_type}&use_yn=${s_use_yn}&stock_type=${s_stock_type}&listed_type=${s_listed_type}`)
            }
      
          })
  
      }

    }


    

  },[])

  const {
    register, 
    handleSubmit, 
    formState:{errors},
    reset
  } = useForm(
    { 
      mode: 'onSubmit'
    }
  )

  const onSubmit = (data) => {

    let submitStatus = true;

    if(submitStatus){

      submitStatus = false;

      let body = {...data, act};
      
      if(act === "U"){
        body = {...body, ipo_id: ipoId}
      }
  
  
      axiosInstance.post('/admin/ipo/modifyIpoDetail', body).then(res => {
  
        alert(res.data.msg);
        
        submitStatus = true;

        if(res.data.success){
          
          if(act === "U"){
            window.location.reload();
          }else{
            navigate(`/aoslwj7110/ipo_list/modify?ipo_id=${body.ipo_id}&act=U&pp=${pp}&pg=${pg}&keyword=${s_keyword}&type=${s_type}&use_yn=${s_use_yn}&stock_type=${s_stock_type}&listed_type=${s_listed_type}`)
          }
  
        }
  
      })

    }else{
      alert('처리중입니다.\n잠시만 기다려주세요.')
    }


  }

  let dateFormat = {
    pattern: {
      value: /^[0-9-]*$/,
      message: "숫자와 하이픈(-)만 입력 가능합니다."
    },
    maxLength: {
      value: 10,
      message: "날짜 형식으로 입력해주세요 (예: 2024-02-22)."
    }
  }

  if(!dataStatus){
    return (
      <div className="mt-48 mb-8 flex flex-col gap-12 ">
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                관리자 정보 수정
              </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <LoadingBar/>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="mt-48 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            공모주 정보 수정
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <div className='w-full flex items-center mx-10 my-4'>
                <InformationCircleIcon className='w-5 h-5 mr-2'/> 
                <span className='text-gray-700 text-sm'>공모주 정보</span>
              </div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300 mx-10 my-2">
                <tbody>
                  {act === "I" && (
                    <tr className="bg-white">
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                        공모주ID <span className='text-red-500'>(필수)</span>
                      </td>
                      <td className="px-6 py-2 w-4/5">
                        <div className='w-2/3'>
                          <Input
                            name="ipo_id"
                            {...register('ipo_id', { 
                              required: "종목ID를 입력해주세요." 
                              ,pattern: {
                                value: /^[0-9]*$/,
                                message: "숫자만 입력 가능합니다."
                              }
                            })}
                          />
                        </div>
                        {
                        errors?.ipo_id &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.ipo_id.message}</span>
                        </div>

                      }
                      </td>
                    </tr>

                  )} 
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                      종목명 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2 w-4/5">
                      <div className='w-2/3'>
                        <Input
                          name="corp_nm"
                          defaultValue={ipoDetail? ipoDetail.corp_nm : ''}
                          {...register('corp_nm', { 
                            required: "종목명을 입력해주세요." 
                          })}
                        />
                      </div>
                      {
                        errors?.corp_nm &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.corp_nm.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      청약 시작일 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          name="st_sub"
                          defaultValue={ipoDetail ? ipoDetail.st_sub : ''}
                          placeholder='날짜 형식으로 입력해주세요 (예: 2024-02-22).'
                          {...register('st_sub', { 
                            required: "청약 시작일을 입력해주세요." ,
                            ...dateFormat
                          })}
                        />
                      </div>
                      {
                        errors?.st_sub &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.st_sub.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      청약 마감일 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          name="end_sub"
                          defaultValue={ipoDetail ? ipoDetail.end_sub : ''}
                          placeholder='날짜 형식으로 입력해주세요 (예: 2024-02-22).'
                          {...register('end_sub', { 
                          required: "청약 마감일을 입력해주세요.",
                          ...dateFormat
                        })}
                        />
                      </div>
                      {
                        errors?.end_sub &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.end_sub.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      확정 공모가
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="confirmed_price"
                          defaultValue={ipoDetail.confirmed_price !== 0 ? ipoDetail.confirmed_price : 0}
                          placeholder='확정되지 않은 경우 0으로 입력해주세요.'
                          {...register('confirmed_price', {
                            pattern: {
                            value: /^[0-9]*$/,
                            message: "숫자만 입력 가능합니다."
                          }})}
                        />
                      </div>
                      {
                        errors?.confirmed_price &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.confirmed_price.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      희망 최소 공모가
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="st_hope_price"
                          defaultValue={ipoDetail.st_hope_price !== 0 ? ipoDetail.st_hope_price : 0}
                          placeholder='확정되지 않은 경우 0으로 입력해주세요.'
                          {...register('st_hope_price', {
                            pattern: {
                              value: /^[0-9]*$/,
                              message: "숫자만 입력 가능합니다."
                            }
                          })}
                        />
                      </div>
                      {
                        errors?.st_hope_price &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.st_hope_price.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      희망 최대 공모가
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="end_hope_price"
                          defaultValue={ipoDetail.end_hope_price !== 0 ? ipoDetail.end_hope_price : 0}
                          placeholder='확정되지 않은 경우 0으로 입력해주세요.'
                          {...register('end_hope_price', {
                            pattern: {
                              value: /^[0-9]*$/,
                              message: "숫자만 입력 가능합니다."
                            }
                          })}
                        />
                      </div>
                      {
                        errors?.end_hope_price &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.end_hope_price.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      공모 경쟁률
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="comp_ratio"
                          defaultValue={ipoDetail.comp_ratio ? ipoDetail.comp_ratio : ''}
                          placeholder='예시) 100:1'
                          {...register('comp_ratio', {})}
                        />
                      </div>
                      {
                        errors?.comp_ratio &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.comp_ratio.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      주간사 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="weekly_company"
                          defaultValue={ipoDetail.weekly_company ? ipoDetail.weekly_company : ''}
                          placeholder='콤마(,)로 구분해주세요.'
                          {...register('weekly_company', {
                            required: "주간사를 입력해주세요." 
                          })}
                        />
                      </div>
                      {
                        errors?.weekly_company &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.weekly_company.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      공모 주식수 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="total_stock"
                          defaultValue={ipoDetail.total_stock ? ipoDetail.total_stock : ''}
                          {...register('total_stock', {
                            required: "공모 주식수를 입력해주세요.",
                            pattern: {
                              value: /^[0-9]*$/,
                              message: "숫자만 입력 가능합니다."
                            }
                          })}
                        />
                      </div>
                      {
                        errors?.total_stock &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.total_stock.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      액면가 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="face_price"
                          defaultValue={ipoDetail.face_price ? ipoDetail.face_price : ''}
                          {...register('face_price', {
                            required: "액면가를 입력해주세요.",
                          })}
                        />
                      </div>
                      {
                        errors?.face_price &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.face_price.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      수요예측 시작일
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="st_forecast_dt"
                          defaultValue={ipoDetail.st_forecast_dt ? ipoDetail.st_forecast_dt : ''}
                          placeholder='날짜 형식으로 입력해주세요 (예: 2024-02-22).'
                          {...register('st_forecast_dt', {...dateFormat})}
                        />
                      </div>
                      {
                        errors?.st_forecast_dt &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.st_forecast_dt.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      수요예측 마감일
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="end_forecast_dt"
                          defaultValue={ipoDetail.end_forecast_dt ? ipoDetail.end_forecast_dt : ''}
                          placeholder='날짜 형식으로 입력해주세요 (예: 2024-02-22).'
                          {...register('end_forecast_dt', {...dateFormat})}
                        />
                      </div>
                      {
                        errors?.end_forecast_dt &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.end_forecast_dt.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      납일일
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="payment_dt"
                          defaultValue={ipoDetail.payment_dt ? ipoDetail.payment_dt : ''}
                          placeholder='날짜 형식으로 입력해주세요 (예: 2024-02-22).'
                          {...register('payment_dt', {...dateFormat})}
                        />
                      </div>
                      {
                        errors?.payment_dt &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.payment_dt.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      환불일
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="refund_dt"
                          defaultValue={ipoDetail.refund_dt ? ipoDetail.refund_dt : ''}
                          placeholder='날짜 형식으로 입력해주세요 (예: 2024-02-22).'
                          {...register('refund_dt', {...dateFormat})}
                        />
                      </div>
                      {
                        errors?.refund_dt &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.refund_dt.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      상장일
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="list_dt"
                          defaultValue={ipoDetail.list_dt ? ipoDetail.list_dt : ''}
                          placeholder='날짜 형식으로 입력해주세요 (예: 2024-02-22).'
                          {...register('list_dt', {...dateFormat})}
                        />
                      </div>
                      {
                        errors?.list_dt &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.list_dt.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      배정공고일
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="assign_dt"
                          defaultValue={ipoDetail.assign_dt ? ipoDetail.assign_dt : ''}
                          placeholder='날짜 형식으로 입력해주세요 (예: 2024-02-22).'
                          {...register('assign_dt', {...dateFormat})}
                        />
                      </div>
                      {
                        errors?.assign_dt &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.assign_dt.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className='w-full flex items-center mx-10 mt-10 mb-4'>
                <InformationCircleIcon className='w-5 h-5 mr-2'/> 
                <span className='text-gray-700 text-sm'>기업 정보</span>
              </div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300 mx-10 my-2">
                <tbody>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                      종목코드 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2 w-4/5">
                      <div className='w-1/3'>
                      
                        <Input
                          className=''
                          name="stock_code"
                          defaultValue={ipoDetail.stock_code ? ipoDetail.stock_code : ''}
                          {...register('stock_code', {
                            required: "종목코드를 입력해주세요.",
                            pattern: {
                              value: /^[0-9]*$/,
                              message: "숫자만 입력 가능합니다."
                            },                        
                          })}
                        />
                        {
                          errors?.stock_code &&
                          <div>
                            <span className='text-red-500 text-sm'>{errors.stock_code.message}</span>
                          </div>

                        }
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      진행상태 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-1/3'>
                        <select id="listed_type" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                          name="listed_type"
                          {...register('listed_type', {
                            required: "진행상태를 입력해주세요."
                          })}
                          >
                            <option value="PO" selected={ipoDetail.listed_type === "PO"}>공모예정</option>
                            <option value="NL" selected={ipoDetail.listed_type === "NL"}>신규상장</option>
                        </select>
                      </div>
                      {
                        errors?.menu_name &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.menu_name.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      주식종류 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-1/3'>
                        <select id="listed_type" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                          name="stock_type"
                          {...register('stock_type', {
                            required: "주식종류를 입력해주세요."
                          })}
                          >
                          <option value="코스닥" selected={ipoDetail.stock_type === "코스닥"}>코스닥</option>
                          <option value="코스피" selected={ipoDetail.stock_type === "코스피"}>코스피</option>
                        </select>
                      </div>
                      {
                        errors?.menu_path &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.menu_path.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      업종 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="sector"
                          defaultValue={ipoDetail.sector ? ipoDetail.sector : ''}
                          {...register('sector', {
                            required: "업종을 입력해주세요.",
                          })}
                        />
                      </div>
                      {
                        errors?.sector &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.sector.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      회사 대표자 
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="corp_rep"
                          defaultValue={ipoDetail.corp_rep ? ipoDetail.corp_rep : ''}
                          {...register('corp_rep', {})}
                        />
                      </div>
                      {
                        errors?.corp_rep &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.corp_rep.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      기업 구분
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="corp_type"
                          defaultValue={ipoDetail.corp_type ? ipoDetail.corp_type : ''}
                          {...register('corp_type', {})}
                        />
                      </div>
                      {
                        errors?.corp_type &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.corp_type.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      주소
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="corp_addr"
                          defaultValue={ipoDetail.corp_addr ? ipoDetail.corp_addr : ''}
                          {...register('corp_addr', {})}
                        />
                      </div>
                      {
                        errors?.corp_addr &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.corp_addr.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      홈페이지
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="corp_hp"
                          defaultValue={ipoDetail.corp_hp ? ipoDetail.corp_hp : ''}
                          {...register('corp_hp', {})}
                        />
                      </div>
                      {
                        errors?.corp_hp &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.corp_hp.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      전화번호
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="corp_tel"
                          defaultValue={ipoDetail.corp_tel ? ipoDetail.corp_tel : ''}
                          {...register('corp_tel', {
                            pattern: {
                              value: /^[0-9-]*$/,
                              message: "숫자와 하이픈(-)만 입력 가능합니다."
                            },
                          })}
                        />
                      </div>
                      {
                        errors?.corp_tel &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.corp_tel.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      최대 주주
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="largest_share_holder"
                          defaultValue={ipoDetail.largest_share_holder ? ipoDetail.largest_share_holder : ''}
                          {...register('largest_share_holder', {})}
                        />
                      </div>
                      {
                        errors?.largest_share_holder &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.largest_share_holder.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300 mx-10 mb-2 mt-10">
                <tbody>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                      사용여부 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2 w-4/5">
                      <div className='w-2/3'>
                        <span>
                          <Radio
                          className="h-4 w-4"
                          name='use_yn'
                          value="Y"
                          defaultChecked={ipoDetail.use_yn ? ipoDetail.use_yn === 'Y' : true}
                          {...register('use_yn', {})}
                          />사용
                        </span>
                        <span className='ml-5'>
                          <Radio
                          className="h-4 w-4"
                          name='use_yn'
                          value="N"
                          defaultChecked={ipoDetail.use_yn ? ipoDetail.use_yn === 'N' : false}
                          {...register('use_yn', {
                            required:"사용여부를 입력해주세요."
                          })}
                          />미사용
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      불러오기 사용여부 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <span>
                          <Radio
                          className="h-4 w-4"
                          name='update_yn'
                          value="Y"
                          defaultChecked={ipoDetail.update_yn ? ipoDetail.update_yn === 'Y' : true}
                          {...register('update_yn', {
                            required:"불러오기 사용여부를 입력해주세요."
                          })}
                          />사용
                        </span>
                        <span className='ml-5'>
                          <Radio
                          className="h-4 w-4"
                          name='update_yn'
                          value="N"
                          defaultChecked={ipoDetail.update_yn ? ipoDetail.update_yn === 'N' : false}
                          {...register('update_yn', {})}
                          />미사용
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-5">
              <Link to={`/aoslwj7110/ipo_list?pp=${pp}&pg=${pg}&keyword=${s_keyword}&type=${s_type}&use_yn=${s_use_yn}&stock_type=${s_stock_type}&listed_type=${s_listed_type}`}>
                <Button
                  className="shadow bg-gray-800 hover:bg-gray-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mr-5"
                  type="button"
                >
                  뒤로
                </Button>
              </Link>
              <Button
                className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                수정
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default IpoModify;
