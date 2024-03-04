import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea
} from "@material-tailwind/react";
import axiosInstance from '@/utils/axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';



export function SendEmail({}) {

  const navigate = useNavigate(); 
  const htmlContent = 
  `
  <div>
    <table width="750" cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;margin:0 auto;background-color:#fff;border:5px solid #e7e7e7;box-sizing:border-box;font-family:맑은 고딕;letter-spacing:-1px;line-height:1.4em;">
      <!-- HEADER -->
      <thead>
        <tr>
          <th colspan="1" rowspan="2" style="width:65px;height:52px;line-height:0;"></th>
          <th colspan="1" rowspan="1" style="height:52px;padding:48px 0 20px 0;border-bottom:2px solid #666;text-align:left;">
            <a href="" target="_blank" style="display: block; font-size: 28px; color: #1f2937; text-decoration: none; line-height: 52px;" rel="noreferrer noopener">
              공모아
            </a>
          </th>
          <th colspan="1" rowspan="2" style="width:65px;height:52px;line-height:0;"></th>
        </tr>
        <tr>
          <td style="padding:40px 0;text-align:left;line-height:45px;color:#333;font-size:36px;">비밀번호 수정</td>
        </tr>
      </thead>
      <!-- CONTENTS -->
      <tbody>
        <tr>
          <td rowspan="3" style="width:65px;"></td>
          <td style="padding:40px 0 30px;text-align:left;line-height:28px;color:#333;font-size:20px;">
            아래 버튼을 통해 비밀번호를 수정해주시기 바랍니다. <br>
          </td>
          <td rowspan="3" style="width:65px;"></td>
        </tr>
        <tr>
          <td style="padding:10px 0 40px;">
            <table cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;">
              <tbody>
                <tr>
                  <td style="width:180px;height:60px;line-height:0;"></td>
                  <td style="width:250px;height:60px;">
                    <a href="/users/updatePwd?email=%%email%%&token=%%token%%" style="padding:20px 0 20px;display:block;line-height:60px;font-weight:bold;font-size:18px;background-color:#1d4ed8;text-decoration:none;color:#fff;text-align:center;border:0">
                      비밀번호 수정하기
                    </a>
                  </td>
                  <td style="width:180px;height:60px;line-height:0;"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
      <!-- FOOTER -->
      <tfoot>
        <tr>
          <td colspan="3" style="padding:30px 65px;text-align:left;line-height:23px;color:#333;font-size:16px;">
            본 메일은 발신전용입니다. <br>
            신청자가 이메일을 잘 못 기입하여 원하지 않는 메일을 받게 되셨을 경우 해당 메일을 <br>
            즉시 삭제해주시기 바랍니다.
          </td>
        </tr>
        <tr>
          <td colspan="3" style="padding:40px 65px;background-color:#e7e7e7;text-align:left;line-height:20px;color:#999;font-size:14px;">
            경기도 남양주시 별내동   Tel: 010-2647-0117 <br>
            COPYRIGHT © GONGMOA ALL RIGHTS RESERVED
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
  `;

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

  const onSubmit = ({  update_st_num, update_end_num }) => {

    let submitStatus = true;

    if(submitStatus){

      submitStatus = false;
      const body = {
        update_st_num,
        update_end_num
      
      }
  
      axiosInstance.post('/admin/ipo/loadIpo', body).then(res => {
  
        submitStatus = true;

        alert(res.data.msg);
        
      })

    }else{
      alert('처리중입니다.\n잠시만 기다려주세요.')
    }//end else

  }

  return (
    <div className="mt-48 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            공모주 불러오기
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300 mx-10 my-2">
                <tbody>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      제목
                    </td>
                    <td className="px-6 py-2">
                      <div className='w-2/3'>
                        <Input
                          name="update_st_num"
                          placeholder='30개 단위로 입력해주세요.'
                          {...register('update_st_num', { required: "업데이트 시작 데이터 갯수를 입력해주세요." })}
                        />
                      </div>
                      {
                        errors?.update_st_num &&
                        <div>
                          <span className='text-red-500 text-sm'>{errors.update_st_num.message}</span>
                        </div>
                      }
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      내용
                    </td>
                    <td className="px-6 py-2">
                      <Textarea/>
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      미리보기
                    </td>
                    <td className="px-6 py-2" dangerouslySetInnerHTML={{ __html: htmlContent }}>
                      
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end p-5">
              <Button
                className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                불러오기
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default SendEmail;
