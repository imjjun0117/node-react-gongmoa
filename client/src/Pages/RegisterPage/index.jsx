import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../action/userAction';

const RegisterPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const payload = useSelector(state => state.user?.payload);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: {errors},
    reset
  } = useForm({mode: 'onSubmit'});
  
  const onSubmit = ({email, password, confirm_password, name, htel2, htel3}) => {

    if(password !== confirm_password){
      alert('비밀번호 확인이 틀렸습니다.');
      return false;
    }
    
    let patternPhone =  /^(01[016789]{1})-[0-9]{3,4}-[0-9]{4}$/;
    
    if(!patternPhone.test(`010-${htel2}-${htel3}`)){

      alert('핸드폰 번호가 유효하지 않습니다.');
      return false;

    }

    const body = {
      email: email,
      password: password,
      name: name,
      htel: `010-${htel2}-${htel3}`
    }

    dispatch(registerUser(body)).then(response => {

      if(response.payload.success){
        alert(response.payload.message);
        navigate('/login');
        reset();
      }else{
        alert(response.payload.message);
      }

    });
    

  }

  const userEmail = {
    required: "이메일을 입력해주세요.",
    pattern :{
      value: /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
      message: "이메일 형식이 아닙니다."
    }
  }
  const userName = {
    required: "닉네임을 입력해주세요.",
    maxLength: {
      value: 10,
      message: "닉네임은 10글자 이하로 작성해주세요."
    },
    pattern: {
      value: /^[^\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
      message: "특수문자 또는 공백을 포함할 수 없습니다."
    }
  }

  const userPassword = {
    required: "비밀번호를 입력해주세요.",
    pattern: {
      value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/,
      message: "영문, 숫자, 특수문자 포함 8 ~ 16자로 입력해주세요." 
    }
  }

  const userConfirmPassword = {
    required : "비밀번호를 확인해주세요.",
    validate: {
      matchPassword: (value) => {
        const { password } = getValues();
        return password === value || '비밀번호가 일치하지 않습니다'
      }
    }
  }

  const userHtel = {
    required: '전화번호를 입력해주세요.',
    pattern: {
      value: /^[0-9]{4}$/,
      message: '유효하지 않는 전화번호입니다.',
    },
  };

  return (
    <section className="bg-gray-200 mx-w-md w-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              회원가입
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
                  {...register('email',userEmail)}
                />
                {
                  errors?.email && 
                  <div>
                    <span className='text-red-500'>
                      {errors.email.message}
                    </span>
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">닉네임</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="사용하실 닉네임을 입력해주세요"
                  maxLength={10}
                  {...register('name', userName)}
                />
                {
                  errors?.name &&
                  <div>
                    <span className='text-red-500'>
                      {errors.name.message}
                    </span>
                  </div>
                }
              </div>
              <div>
                <div className="flex justify-center">
                  <div>
                    <label htmlFor="htel1" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      전화번호
                    </label>
                    <input
                      type="text"
                      id="htel1"
                      className="border text-sm rounded-lg marker:block w-[60%] p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      value={'010'}
                      readOnly
                      maxLength={3}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="htel2" className="block mb-2 text-sm font-medium text-gray-900 ">
                      &nbsp;
                    </label>
                    <input
                      type="text"
                      id="htel2"
                      className=" border text-sm rounded-lg marker:block w-[60%] p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1234"
                      maxLength={4}
                      {...register('htel2', userHtel)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="htel3" className="block mb-2 text-sm font-medium text-gray-900">
                      &nbsp;
                    </label>
                    <input
                      type="text"
                      id="htel3"
                      className="border text-sm rounded-lg marker:block w-[60%] p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5678"
                      maxLength={4}
                      {...register('htel3', userHtel)}
                    />
                  </div>

                  <div className='w-[30%]'>
                    <label htmlFor="auth" className="block mb-2 text-sm font-medium text-gray-900">
                      &nbsp;
                    </label>
                    <button
                      type="submit"
                      className=" text-white w-full bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-2.5"
                    >
                    본인인증
                    </button>   
                  </div>
                </div>
                  {errors?.htel3 && (
                    <div>
                      <span className="text-red-500">{errors.htel3.message}</span>
                    </div>
                  )}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
              회원가입
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                이미 가입하셨나요? <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500"> 로그인</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
