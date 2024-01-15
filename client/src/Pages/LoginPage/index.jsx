import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../action/userAction'
import { useNavigate } from 'react-router-dom'
import KakaoBtn from './Kakao/KakaoBtn';

const LoginPage = () => {
  
  const dispatch = useDispatch();
  const payload = useSelector(state => state.user?.payload);
  const navigate = useNavigate();

  const {
    register, 
    handleSubmit, 
    formState:{errors},
    reset
  } = useForm({ mode: 'onSubmit' })

  const onSubmit = ({email, password, remember}) => {

    const body = {
      email: email,
      password: password,
      remember: remember
    }

    dispatch(loginUser(body)).then(response => {
      
      if(response.payload.loginSuccess){
        navigate('/');
        reset();
      }else{
        alert(response.payload.message);
      }

    });
  }

  const userEmail = {
    required: "이메일을 입력해주세요.",
    pattern: {
      value: /@/,
      message: "이메일 형식이 아닙니다."
    }
  }
  
  const userPassword = {
    required: "비밀번호를 입력해주세요." 
  }

  return (
    <section className="bg-gray-200 mx-w-md w-full h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              로그인
            </h1>      
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">이메일</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="이메일을 입력해주세요"
                  {...register('email', userEmail)}
                />
                {
                  errors?.email &&
                  <div>
                    <span className='text-red-500'>{errors.email.message}</span>
                  </div>

                }
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register('password', userPassword)}
                />
                {
                  errors?.password &&
                  <div>
                    <span className='text-red-500'>{errors.password.message}</span>
                  </div>

                }
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      name="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      {...register('remember', {})}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">로그인 상태 유지</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-blue-300">비밀번호를 잊으셨나요?</a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                로그인
              </button>
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="mx-4 text-sm font-light text-gray-500 dark:text-gray-400">또는</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <KakaoBtn/>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                회원정보가 없다면? <a href="./register" className="font-medium text-blue-600 hover:underline dark:text-blue-500"> 회원가입</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
