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

export function UserModify() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState({});
  const id = searchParams.get('id');
  const s_keyword = searchParams.get('keyword') ?  searchParams.get('keyword') : '';
  const s_type = searchParams.get('type') ?  searchParams.get('type') : '';
  const s_user_type = searchParams.get('user_type') ? searchParams.get('user_type') : '';

  const [dataStatus, setDataStatus] = useState(true);
  
  useEffect(() => {

    if(dataStatus){

      setDataStatus(false);

      if(!id){
        alert('잘못된 접근입니다.');
        navigate(`/aoslwj7110/user_list?keyword=${s_keyword}&type=${s_type}&user_type=${s_user_type}`)
      }
  
      let params = {
        id
      }
  
      axiosInstance.get('/admin/user/getUserDetail', {params}).then(res => {
  
        if(res.data.success){
  
          setUserDetail(res.data.userDetail);


          setDataStatus(true);

        }else{
          alert(res.data.msg);
          navigate(`/aoslwj7110/user_list?keyword=${s_keyword}&type=${s_type}&user_type=${s_user_type}`)
        }
  
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

  const onSubmit = ({password, password_chk}) => {

    if(password !== password_chk){
      alert('비밀번호 확인을 제대로 입력해주세요.');
      return false;
    }

    let submitStatus = true;

    if(submitStatus){

      submitStatus = false;

      let body = {
        password,
        id
      };
    
      axiosInstance.post('/admin/user/modifyPassword', body).then(res => {
  
        console.log(res.data);

        alert(res.data.msg);
        
        submitStatus = true;

        if(res.data.success){
        
          navigate(`/aoslwj7110/user_list?keyword=${s_keyword}&type=${s_type}&user_type=${s_user_type}`)
        
        }
  
      })

    }else{
      alert('처리중입니다.\n잠시만 기다려주세요.')
    }


  }

  if(!dataStatus){
    return (
      <div className="mt-48 mb-8 flex flex-col gap-12 ">
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                회원 정보 수정
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
            회원 정보 수정
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              
              <div className='w-full flex items-center mx-10 mt-10 mb-4'>
                <InformationCircleIcon className='w-5 h-5 mr-2'/> 
                <span className='text-gray-700 text-sm'>사용자 정보</span>
              </div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300 mx-10 my-2">
                <tbody>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      회원구분
                    </td>
                    <td className="px-6 py-2">
                        {userDetail.type}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                      닉네임 
                    </td>
                    <td className="px-6 py-2 w-4/5">
                      <div className='w-1/3'>
                        {userDetail.name}
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      이메일
                    </td>
                    <td className="px-6 py-2">
                      {userDetail.email}
                    </td>
                  </tr>
                  
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      비밀번호 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          type="password"
                          name="password"
                          {...register('password', {
                            required: "비밀번호를 입력해주세요.",
                          })}
                        />
                      </div>
                      {
                        errors?.password &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.password.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      비밀번호 확인 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          type="password"
                          name="password_chk"
                          {...register('password_chk', {
                            required: "비밀번호 확인을 입력해주세요.",
                          })}
                        />
                      </div>
                      {
                        errors?.password_chk &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.password_chk.message}</span>
                        </div>

                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      가입일
                    </td>
                    <td className="px-6 py-2">
                      {userDetail.reg_dt ? userDetail.reg_dt : '-'}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      수정일
                    </td>
                    <td className="px-6 py-2">
                      {userDetail.update_dt ? userDetail.update_dt : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300 mx-10 mb-2 mt-10">
                <tbody>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                      블랙리스트 여부
                    </td>
                    <td className="px-6 py-2 w-4/5">
                      <div className='w-2/3'>
                        <span>
                          {userDetail.black_yn}
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      관리자 여부
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <span>
                          {userDetail.admin_yn}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-5">
              <Link to={`/aoslwj7110/user_list?keyword=${s_keyword}&type=${s_type}&user_type=${s_user_type}`}>
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

export default UserModify;
