import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input
} from "@material-tailwind/react";
import axiosInstance from '@/utils/axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';


export function IpoLoad({}) {

  const navigate = useNavigate();
  

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

  const onSubmit = ({  update_st_num, update_end_num }) => {

    let submitStatus = true;

    if(submitStatus){

      submitStatus = false;
      const body = {
        update_st_num,
        update_end_num
      
      }
  
      axiosInstance.post('/admin/ipo/loadIpo', body).then(res => {
  
        submitStatus = true;

        alert(res.data.msg);
        
      })

    }else{
      alert('처리중입니다.\n잠시만 기다려주세요.')
    }//end else

  }

  return (
    <div className="mt-48 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            공모주 불러오기
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300 mx-10 my-2">
                <tbody>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      업데이트 시작 데이터 갯수
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          name="update_st_num"
                          placeholder='30개 단위로 입력해주세요.'
                          {...register('update_st_num', { required: "업데이트 시작 데이터 갯수를 입력해주세요." })}
                        />
                        <br/>
                        <span> 업데이트를 시작할 데이터 순서입니다.</span>
                      </div>
                      {
                        errors?.update_st_num &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.update_st_num.message}</span>
                        </div>
                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      업데이트 종료 데이터 갯수
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          name="update_end_num"
                          placeholder='30개 단위로 입력해주세요.'
                          {...register('update_end_num', { required: "업데이트 종료 데이터 갯수를 입력해주세요." })}
                        />
                        <br/>
                        <span> 업데이트를 끝낼 데이터 순서입니다.</span>
                      </div>
                      {
                        errors?.update_end_num &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.update_end_num.message}</span>
                        </div>
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-5">
              <Button
                className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                불러오기
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default IpoLoad;
