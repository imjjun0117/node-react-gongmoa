import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { checkPwd } from '../../../action/userAction'
import { useNavigate } from 'react-router-dom'


const CheckPassword = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCheckedPwd = useSelector(state => state.user?.isCheckedPwd);
  const isKakao = useSelector(state => state.user?.isKakao);

  useEffect(() => {
    
    if(isCheckedPwd || isKakao){
      navigate('/users/account');
    }

  },[])

  const {
    register, 
    handleSubmit, 
    formState:{errors},
    reset
  } = useForm({ mode: 'onBlur' })

  const onSubmit = ({password}) => {

    const body = {
      password: password
    }

    dispatch(checkPwd(body)).then(response => {
      
      if(response.payload.success){
        navigate('/users/account');
        reset();
      }else{
        alert(response.payload.message);
      }

    });
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
              비밀번호 확인
            </h1>      
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              
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
              
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                확인하기
              </button>
              
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CheckPassword
