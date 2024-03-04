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
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import LoadingBar from '@/layouts/loadingBar';

export function UserMenuModify() {

  const [searchParams] = useSearchParams();
  const act = searchParams.get('act');
  const code = searchParams.get('code');
  const pCode = searchParams.get('p_code');
  const [targetCode, setTargetCode] = useState('');
  const navigate = useNavigate();
  const [menu, setMenu] = useState({});
  const [dataStatus, setDataStatus] = useState(true);
  
  useEffect(() => {

    if(dataStatus){

      setDataStatus(false);

      if(!act){
        alert('잘못된 접근입니다.');
        return navigate('/aoslwj7110');
      }
  
      if(act === 'U'){
  
        if(code){
          
          setTargetCode(code);
  
          let params = {
            code
          };
  
          axiosInstance.get('/admin/user_menu/getUserMenuDetail', {params}).then(res => {
  
            if(!res.data.success){
              alert(res.data.msg);
              return navigate('/aoslwj7110');
            }
    
            setMenu(res.data.menu);
            reset({
              menu_name: menu ? menu.name : '',
              menu_path: menu ? menu.path : '',
  
            })

            setDataStatus(true);

          })
  
        }else{
          alert('잘못된 접근입니다.')
          return navigate('/aoslwj7110');
        }
      }else{
        let params = {
          code
        };
        axiosInstance.get('/admin/user_menu/getUserMenuCode', {params}).then(res => {
  
          if(!res.data.success){
            alert(res.data.msg);
            return navigate('/aoslwj7110');
          }
  
          setTargetCode(res.data.code);
          setDataStatus(true);
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

  const onSubmit = ({ menu_name, menu_path, use_yn}) => {

    let submitStatus = true;

    if(submitStatus){

      const body = {
        act, 
        menu_code: targetCode,
        menu_name,
        menu_path,
        use_yn
      }
  
      axiosInstance.post('/admin/user_menu/modifyUserMenu', body).then(res => {
  
        alert(res.data.msg);

        submitStatus = true;

        if(res.data.success){
        
          navigate(`/aoslwj7110/user_menu?p_code=${pCode ? pCode : ''}`)
        }
  
      })

    }else{
      alert('처리중입니다.\n잠시만 기다려주세요.');
    }


  }

  const handleRadioChange = (value) => {
    setMenu((prev) => ({
      ...prev,
      use_yn: value,
    }));
  };

  if(!dataStatus){
    return (
      <div className="mt-48 mb-8 flex flex-col gap-12 ">
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                사용자 메뉴 수정
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
            사용자 메뉴 수정
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300 mx-10 my-2">
                <tbody>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                      메뉴코드 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2 w-4/5">
                      <div className='w-2/3'>
                        <Input
                          name="menu_code"
                          defaultValue={targetCode}
                          readOnly
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      메뉴명 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          name="menu_name"
                          defaultValue={menu ? menu.name : ''}
                          {...register('menu_name', { required: "메뉴명을 입력해주세요." })}
                        />
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
                      경로 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          className=''
                          name="menu_path"
                          defaultValue={menu ? menu.path : ''}
                          placeholder='※하위메뉴가 있을 경우 #를 입력해주세요.'
                          {...register('menu_path', { required: "경로를 입력해주세요." })}
                        />
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
                      사용여부 <span className='text-red-500'>(필수)</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <span>
                          <Radio
                          className="h-4 w-4"
                          name='use_yn'
                          value="Y"
                          checked={menu.use_yn ? menu.use_yn === 'Y' : true}
                          onClick={() => {handleRadioChange('Y')}}
                          {...register('use_yn', {})}
                          />사용
                        </span>
                        <span className='ml-5'>
                          <Radio
                          className="h-4 w-4"
                          name='use_yn'
                          value="N"
                          checked={menu.use_yn ? menu.use_yn === 'N' : false}
                          onClick={() => {handleRadioChange('N')}}
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
              <Link to={`/aoslwj7110/user_menu?p_code=${pCode ? pCode : ''}`}>
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
                {act === 'I' ? '등록' : '수정'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default UserMenuModify;
