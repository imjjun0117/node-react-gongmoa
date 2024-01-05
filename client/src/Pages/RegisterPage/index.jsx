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
  } = useForm({mode: 'onBlur'});
  
  const onSubmit = ({email, password, confirm_password, name, htel}) => {

    if(password !== confirm_password){
      alert('비밀번호 확인이 틀렸습니다.');
      return false;
    }

    const body = {
      email: email,
      password: password,
      name: name,
      htel: htel
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
      value: /@/,
      message: "이메일 형식이 아닙니다."
    }
  }
  const userName = {
    require: "닉네임을 입력해주세요.",
    maxLength: {
      value: 10,
      message: "닉네임은 10글자 이하로 작성해주세요."
    },
    pattern: {
      value: /^\S*$/,
      message: "닉네임에는 공백을 포함할 수 없습니다."
    },
    pattern: {
      value: /^[^\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
      message: "닉네임에는 특수문자를 포함할 수 없습니다."
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
    required: "전화번호를 입력해주세요.",
    pattern: {
      value: /^010-[0-9]{4}-[0-9]{4}$/,
      message: "유효하지 않는 전화번호입니다." 
    },
    maxLength: {
      value: 13, // 최대 길이 지정
      message: '전화번호는 13자 이하여야 합니다.',
    },
    onChange: (e) => { //전화번호 형태 자동입력
      let inputPhoneNumber = e.target.value;

      // 정규식을 사용하여 숫자만 추출
      const numbersOnly = inputPhoneNumber.replace(/\D/g, '');

      // 010 뒤에 숫자가 8자리일 때와 그 외의 경우에 따라 '-'를 추가
      const formattedPhoneNumber = numbersOnly.replace(/(\d{3})(\d{4})(\d{0,4})/, (match, p1, p2, p3) => {
        return p3 ? `${p1}-${p2}-${p3}` : p1.length === 3 ? `${p1}-${p2}` : `${p1}-${p2}`;
      });
    
      setValue('htel', formattedPhoneNumber);

    },
    
  }


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
                <label htmlFor="phone-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  전화번호 :
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 19 18">
                      <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="htel"
                    aria-describedby="helper-text-explanation"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="010-1234-5678"
                    value={getValues('htel')}
        
                    {...register('htel', userHtel)}
                  />
                </div>
                {
                  errors?.htel &&
                  <div>
                    <span className='text-red-500'>{errors.htel.message}</span>
                  </div>
                }
                <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Select a phone number that matches the format.
                </p>
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
