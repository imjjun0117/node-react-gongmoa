import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../action/userAction';
import axiosInstance from '../../utils/axios';

const RegisterPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showAuth, setShowAuth] = useState(false);
  const [isEmailAuth, setIsEmailAuth] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60);
  const [email, setEmail] = useState('');
  const [emailToggle, setEmailToggle] = useState(false);
  
  const {
    register,
    handleSubmit,
    getValues,
    formState: {errors},
    reset
  } = useForm({mode: 'onSubmit'});

  useEffect(() => {

    setTimeRemaining(5 * 60);

    // showAuth 값이 true일 때 타이머 시작
    if (showAuth) {

      const timerId = setInterval(() => {
      
        setTimeRemaining((prevTime) => {
        
          if(document.getElementById('email').value !== email){
            setShowAuth(false);
            setIsEmailAuth(false);
            clearInterval(timerId);
          }

          if (prevTime === 0) {
            // 타이머가 0이면 clearInterval로 타이머 중지
            clearInterval(timerId);
            setShowAuth(false); // 원하는 동작 수행 (예: 인증 유효시간 종료)
          }
          return prevTime - 1;

        });

      }, 1000);

      // 컴포넌트가 언마운트되면 타이머 해제
      return () => clearInterval(timerId);
    }
  }, [showAuth, isEmailAuth]);

  
  const onSubmit = ({email, password, confirm_password, name, code}) => {

    if(!isEmailAuth){
      alert('이메일 인증을 완료해주세요');
      return false;
    }

    if(password !== confirm_password){
      alert('비밀번호 확인이 틀렸습니다.');
      return false;
    }
    

    const body = {
      email: email,
      password: password,
      name: name,
      code : code,
      email_yn : emailToggle ? 'Y' : 'N'
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

  const userCode = {
    required: "인증번호를 입력해주세요."
  }

  const sendCode = () => {

    let setFlag = true;
    setShowAuth(false);
    setIsEmailAuth(false);

    if(setFlag){
      setFlag = false;
      const email = document.getElementById('email').value;
  
      if(!email){
        alert('이메일을 입력해주세요.');
        return false;
      }

      //이메일 유효성 검사
      let patternEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  
      if(!patternEmail.test(email)){
        alert('이메일 형식이 아닙니다.')
        return false
      }
  
      let body = {
        email : email
      }
  
      axiosInstance.post(`/users/sendCode`, body).then(res => {
    
        if(!res.data.success){
          alert(res.data.message);
          return false;
        }
  
        alert('인증번호를 전송하였습니다.');
        setShowAuth(true);
        setFlag = true;
        setEmail(email);
      })

    }else{

      alert('처리중입니다. 잠시만 기다려주세요.');

    }//end else

  }

  const codeChk = () => {

    if(isEmailAuth){
      alert('이미 인증이 완료된 상태입니다.')
      return false;
    }

    if(timeRemaining === 0){
      alert('인증 시간이 만료되었습니다.\n다시 시도해주세요.')
      return false;
    }//end if

    const email = document.getElementById('email').value;
    const code = document.getElementById('code').value;

    if(code){

      let body = {
        email : email,
        code : code
      }

      axiosInstance.post('/users/codeChk', body).then(res => {

        if(!res.data.success){
          alert(res.data.message);
          return false;
        }

        setIsEmailAuth(true);

      })

    }

  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };


  const handleToggle = () => {

    setEmailToggle(!emailToggle);

  }

  return (
    <section className="bg-gray-200 mx-w-md w-full h-screen pt-4">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
              회원가입
            </h1>      
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className='flex justify-between'>
                <div className='w-[70%]'>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">이메일<span className='text-red-500'> (필수)</span></label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-700 border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gry-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="이메일을 입력해주세요"
                    {...register('email',userEmail)}
                  />
                </div>
                <div className='w-[30%]'>
                  <label htmlFor="auth" className="block mb-2 text-sm font-medium text-gray-900">
                    &nbsp;
                  </label>
                  <button
                    type="button"
                    className=" text-white w-full bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-2.5"
                    onClick={sendCode}
                    >
                    인증 코드 발송
                  </button>   
                </div>
              </div>
                {
                  errors?.email && 
                  <div>
                    <span className='text-red-500'>
                      {errors.email.message}
                    </span>
                  </div>
                }
              {showAuth &&
                <div className={`flex justify-between`}>
                  <div className='w-[50%]'>
                    <label htmlFor="auth_key" className="block mb-2 text-sm font-medium text-white">인증번호</label>
                    <input
                      type="text"
                      name="code"
                      id="code"
                      className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      placeholder="인증번호를 입력해주세요."
                      maxLength={10}
                      {...register('code',userCode)}
                      readOnly={isEmailAuth}                  
                    />
                  </div>
                  <div className='w-[15%] mt-9'>
                    {
                      isEmailAuth ? (
                        <span className='text-green-500 text-sm'>
                        인증완료
                        </span>

                      ) : (
                        <span className='text-red-500 text-sm'>
                        {formatTime(timeRemaining)}
                        </span>

                      )
                    }
                  </div>
                  {
                    !isEmailAuth &&
                    <div className='w-[27%]'>
                      <label htmlFor="auth" className="block mb-2 text-sm font-medium text-gray-900">
                        &nbsp;
                      </label>
                      <button
                        type="button"
                        className=" text-white w-full bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-2.5"
                        onClick={codeChk}
                        >
                        인증하기
                      </button>   
                    </div>
                  }
                </div>
              }
              {
              errors?.code && 
              <div>
                <span className='text-red-500'>
                  {errors.code.message}
                </span>
              </div>
              }
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">비밀번호<span className='text-red-500'> (필수)</span></label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-white">비밀번호 확인</label>
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  placeholder="••••••••"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">닉네임<span className='text-red-500'> (필수)</span></label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
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
                <label htmlFor="alarm" className="block text-sm font-medium text-white">알림설정</label>
                <div className="flex items-center mb-2">
                  <span className="mr-3 text-sm font-medium text-gray-300">E-Mail</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value="Y"
                      className="sr-only peer"
                      onChange={handleToggle}
                      id="email_yn"
                    />
                    <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4peer-focus:ring-blue-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs font-light text-gray-400">
                  즐겨찾기 한 공모주 정보를 받아보실 수 있습니다!
                </p>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
              >
              회원가입
              </button>
              <p className="text-sm font-light text-gray-400">
                이미 가입하셨나요? <a href="#" className="font-medium hover:underline text-blue-500"> 로그인</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
