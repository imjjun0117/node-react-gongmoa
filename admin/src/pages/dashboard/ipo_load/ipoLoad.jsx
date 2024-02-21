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
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import LoadingBar from '@/layouts/loadingBar';

export function IpoLoad({}) {

  const navigate = useNavigate();
  const [ipoLoad, setIpoLoad] = useState({});
  const [dataStatus, setDataStatus] = useState(true);
  
  useEffect(() => {

    if(dataStatus){

      setDataStatus(false);

      axiosInstance.get('/admin/ipo/getIpoLoad').then(res => {
        
        if(res.data.success){
          setIpoLoad(res.data.ipoLoad);
          reset({
            time : ipoLoad ? ipoLoad.time : '',
            update_data_num : ipoLoad ? ipoLoad.update_data_num : '',
          })

          setDataStatus(true);
          
        }else{

          alert(res.data.msg);
          setDataStatus(true);
          navigate('/aoslwj7110');
  
        }//end else
      })

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

  const onSubmit = ({ time, update_data_num, use_yn}) => {

    let submitStatus = true;

    if(submitStatus){

      submitStatus = false;
      const body = {
        time,
        update_data_num,
        use_yn
      }
  
      axiosInstance.post('/admin/ipo/modifyIpoLoad', body).then(res => {
  
        submitStatus = true;

        alert(res.data.msg);
        if(res.data.success){
          window.location.reload();
        }
      })

    }else{
      alert('처리중입니다.\n잠시만 기다려주세요.')
    }//end else

  }

  if(!dataStatus){
    return (
      <div className="mt-48 mb-8 flex flex-col gap-12 ">
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                관리자 메뉴 수정
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
            관리자 메뉴 수정
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300 mx-10 my-2">
                <tbody>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                      업데이트 시간
                    </td>
                    <td className="px-6 py-2 w-4/5">
                      <div className='w-2/3'>
                        <Input
                          name="time"
                          defaultValue={ipoLoad ? ipoLoad.time : ''}
                          {...register('time', { required: "시간을 입력해주세요." })}
                        />
                        <br/>
                        <span> (초 분 시간 일 달 요일) 순으로 입력해주세요.</span><br/>
                        <span>  예시&#41; 23 50 17 * * * (매일 오후 5시 50분 23초에 업데이트)</span>
                      </div>
                      {
                        errors?.time &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.time.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      업데이트 데이터 갯수
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          name="update_data_num"
                          defaultValue={ipoLoad ? ipoLoad.update_data_num : ''}
                          {...register('update_data_num', { required: "업데이트 할 데이터 갯수" })}
                        />
                        <br/>
                        <span> 데이터는 최근 순으로 업데이트 갯수를 정해주세요.</span>
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
                      사용여부
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <span>
                          <Radio
                          className="h-4 w-4"
                          name='use_yn'
                          value="Y"
                          defaultChecked={ipoLoad.use_yn ? ipoLoad.use_yn === 'Y' : false}
                          {...register('use_yn', {})}
                          />사용
                        </span>
                        <span className='ml-5'>
                          <Radio
                          className="h-4 w-4"
                          name='use_yn'
                          value="N"
                          defaultChecked={ipoLoad.use_yn ? ipoLoad.use_yn === 'N' : false}
                          {...register('use_yn', {})}
                          />미사용
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-5">
              <Button
                className="shadow bg-gray-800 hover:bg-gray-700 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mr-5"
                type="button"
              >
                뒤로
              </Button>
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

export default IpoLoad;
