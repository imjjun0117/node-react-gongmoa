import React from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../../utils/axios'
import { useNavigate } from 'react-router-dom'


const FindPassword = () => {

  const navigate = useNavigate();

  const {
    register, 
    handleSubmit, 
    formState:{errors},
    reset
  } = useForm({ mode: 'onBlur' })

  const onSubmit = ({email}) => {

    const body = {
      email: email
    }

    axiosInstance.post('/users/findPwd', body).then(res => {

      if(!res.data.success){
        alert(res.data.message);
        return false;
      }

      alert('이메일이 전송되었습니다.\n이메일 가이드를 따라주십시오.');
      navigate('/');

    })

  } 
  
  const userEmail = {
    required: "이메일을 입력해주세요.",
    pattern :{
      value: /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
      message: "이메일 형식이 아닙니다."
    }
  }

  return (
    <section className="bg-gray-200 mx-w-md w-full h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              이메일 확인
            </h1>      
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">이메일</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="비밀번호 찾기위해 이메일을 입력해주세요."
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register('email', userEmail)}
                />
                {
                  errors?.email &&
                  <div>
                    <span className='text-red-500'>{errors.email.message}</span>
                  </div>

                }
              </div>
              
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                비밀번호 찾기
              </button>
              
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FindPassword

