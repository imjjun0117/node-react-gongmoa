import { loginAdmin } from '@/action/adminAction';
import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function SignIn() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register, 
    handleSubmit, 
    formState:{errors},
    reset
  } = useForm({ mode: 'onSubmit' })

  const onSubmit = ({email, password}) => {

    const body = {
      email: email,
      password: password
    }

    dispatch(loginAdmin(body)).then(response => {
      
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
      value: /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
      message: "이메일 형식이 아닙니다."
    }
  }
  
  const userPassword = {
    required: "비밀번호를 입력해주세요." 
  }

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">로그인</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">관리자외에는 접근을 제한합니다.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/3" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1 flex flex-col gap-4">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              이메일
            </Typography>
            <Input
              type="email"
              size="lg"
              name="email"
              id="email"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              {...register('email', userEmail)}
            />
            {
              errors?.email &&
              <div>
                <span className='text-red-500 text-sm'>{errors.email.message}</span>
              </div>

            }
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              비밀번호
            </Typography>
            <Input
              type="password"
              size="lg"
              name="password"
              id="password"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              {...register('password', userPassword)}
            />
            {
              errors?.password &&
              <div>
                <span className='text-red-500 text-sm'>{errors.password.message}</span>
              </div>

            }
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            로그인
          </Button>
        </form>

      </div>
      

    </section>
  );
}

export default SignIn;
