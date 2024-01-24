import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';


const UpdatePassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const navigate = useNavigate();

  useEffect(() => {

    if(!email && !token){
      alert('잘못된 접근입니다.');
      navigate('/');
    }



  },[])


  const {
    register, 
    handleSubmit, 
    formState:{errors},
    getValues,
    reset
  } = useForm({ mode: 'onBlur' })

  const onSubmit = ({password, confirm_password}) => {

    if(password !== confirm_password){
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }//end if

    const body = {
      email: email,
      token: token,
      password: password
    }

    axiosInstance.post('/users/updatePwd', body).then(res => {

      if(!res.data.success){
        alert(res.data.message);
        return false;
      }

      alert('비밀번호가 변경되었습니다. 로그인을 시도해주세요.');
      navigate('/');

    })

  
  } 
  
  const userPassword = {
    pattern: {
      value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/,
      message: "영문, 숫자, 특수문자 포함 8 ~ 16자로 입력해주세요." 
    }
  }

  const userConfirmPassword = {
    validate: {
      matchPassword: (value) => {
        const { password } = getValues();
        return password === value || '비밀번호가 일치하지 않습니다'
      }
    }
  }

  return (
    <section className="bg-gray-200 mx-w-md w-full h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              비밀번호 변경
            </h1>      
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              
              <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    {...register('password',userPassword)}
                  />
                  {
                    errors?.password && 
                    <div>
                      <span className='text-red-500'>
                        {errors.password.message}
                      </span>
                    </div>
                  }
                </div>
                <div>
                  <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호 확인</label>
                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    placeholder="••••••••"
                    className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    {...register('confirm_password',userConfirmPassword)}
                    />
                    {
                      errors?.confirm_password && 
                      <div>
                        <span className='text-red-500'>
                          {errors.confirm_password.message}
                        </span>
                      </div>
                    }
                </div>
              
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                변경하기
              </button>
              
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UpdatePassword
