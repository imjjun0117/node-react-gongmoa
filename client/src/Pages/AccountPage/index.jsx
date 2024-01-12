import React, { useEffect, useState } from 'react'
import {set, useForm} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateKakao, updateUser } from '../../action/userAction';
import { setCheckedPwd } from '../../slice/userSlice'

const AccountPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userInfo = useSelector(state => state.user?.userData);
  const [smsToggle, setSmsToggle] = useState(userInfo.sms_yn === 'Y');
  const isCheckedPwd = useSelector(state => state.user?.isCheckedPwd);
  const isKakao = useSelector(state => state.user?.isKakao);

  useEffect(() => {


    if(!isCheckedPwd && !isKakao){
      navigate('/users/checkPwd');
    }

    dispatch(setCheckedPwd());

  },[])

  const {
    register,
    handleSubmit,
    getValues,
    formState: {errors},
    reset
  } = useForm({mode: 'onSubmit'});
  
  const onSubmit = ({email, password, confirm_password, name, htel2, htel3, sms_time = ""}) => {

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
      htel: `010-${htel2}-${htel3}`,
      sms_yn : smsToggle,
      sms_time : sms_time
    }

    if(isKakao){
      console.log('----탔음');
      dispatch(updateKakao(body)).then(response => {
  

        console.log(response);
        if(response.payload.success){
          alert(response.payload.message);
          navigate('/login');
          reset();
        }else{
          alert(response.payload.message);
        }
  
      });

    }else{
      dispatch(updateUser(body)).then(response => {
  
        if(response.payload.success){
          alert(response.payload.message);
          navigate('/login');
          reset();
        }else{
          alert(response.payload.message);
        }
  
      });

    }
    

  }
  const handleToggle = (e) => {
    setSmsToggle(e.target.checked);
  };

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

  const userHtel = {
    required: '전화번호를 입력해주세요.',
    pattern: {
      value: /^[0-9]{4}$/,
      message: '유효하지 않는 전화번호입니다.',
    },
  };

  const userSmsTime = {
    required : '시간을 설정해주세요.',
  }

  return (
    <section className="bg-gray-200 mx-w-md w-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              회원정보 수정{isKakao ? '(소셜회원)' : ''}
            </h1>      
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">이메일<span className='text-red-500'> (필수)</span></label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className=" border sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 :focus:border-blue-500"
                  placeholder="이메일을 입력해주세요"
                  defaultValue={userInfo.email}
                  readOnly={isKakao}
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
              {
              !isKakao && 
              <>
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
              </>
              }
              
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">닉네임<span className='text-red-500'> (필수)</span></label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bordersm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="사용하실 닉네임을 입력해주세요"
                  defaultValue={userInfo.name}
                  readOnly={isKakao}
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
                    전화번호<span className='text-red-500'> (필수)</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="htel1"
                      className="border text-sm rounded-lg marker:block w-[25%] p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      value={'010'}
                      readOnly
                      maxLength={3}
                    />
                    <span className="mx-2 text-sm font-medium text-white">-</span>
                    <input
                      type="text"
                      id="htel2"
                      className="border text-sm rounded-lg marker:block w-[25%] p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1234"
                      defaultValue={userInfo.htel.split('-')[1]}
                      maxLength={4}
                      {...register('htel2', userHtel)}
                    />
                    <span className="mx-2 text-sm font-medium text-white">-</span>
                    <input
                      type="text"
                      id="htel3"
                      className="border text-sm rounded-lg marker:block w-[25%] p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5678"
                      defaultValue={userInfo.htel.split('-')[2]}
                      maxLength={4}
                      {...register('htel3', userHtel)}
                    />
                  </div>
                </div>

                <div className='w-[30%]'>
                  <label htmlFor="auth" className="block mb-2 text-sm font-medium text-gray-900">
                    &nbsp;
                  </label>
                  <button
                    type="submit"
                    className=" text-white w-full bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-1 py-3"
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
              <div>
                <label htmlFor="alarm" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">알림설정</label>
                <div className="flex items-center">
                  <span className="mr-3 text-sm font-medium text-gray-300">SMS</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value="Y"
                      className="sr-only peer"
                      checked = {smsToggle ? true : false }
                      onChange={handleToggle}
                      id="sms_yn"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                  {smsToggle &&
                    <select
                    id="sms_time"
                    name="sms_time"
                    className="text-sm ml-4 rounded-lg p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    {...register('sms_time', userSmsTime)}
                  >
                    <option value="">시간설정</option>
                    <option value="30m" selected={userInfo.sms_time === '30m'}>30분 전에 받기</option>
                    <option value="1h" selected={userInfo.sms_time === '1h'}>1시간 전에 받기</option>
                    <option value="2h" selected={userInfo.sms_time === '2h'}>2시간 전에 받기</option>
                  </select>
                  }
                  {errors?.sms_time && (
                    <div>
                      <span className="ml-5 text-red-500">{errors.sms_time.message}</span>
                    </div>
                  )
                  }
                </div>
              </div>
              <div className='flex justify-between'>
                <button
                  type="submit"
                  className="w-full mr-10 text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                수정
                </button>         
                <button
                  className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                회원탈퇴
                </button>         

              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccountPage
