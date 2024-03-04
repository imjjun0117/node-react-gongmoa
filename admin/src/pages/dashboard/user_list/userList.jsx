import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Switch,
  Button,
  Input,
  Radio,
} from "@material-tailwind/react";
import { authorsTableData } from "@/data";
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LoadingBar from '@/layouts/loadingBar';

export function UserList() {

  const [searchParams, setSearchParams] = useSearchParams();
  const s_keyword = searchParams.get('keyword') ?  searchParams.get('keyword') : '';
  const s_type = searchParams.get('type') ?  searchParams.get('type') : '';
  const s_user_type = searchParams.get('user_type') ? searchParams.get('user_type') : '';

  const [userList, setUserList] = useState([]);
  const [dataStatus, setDataStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    if(searchParams.size !== 0){

      fetchUser();
    }

  }, [])
  
  const fetchUser = async() => {

    if(dataStatus){
      
      setDataStatus(false);

      let params = {
      
        keyword: s_keyword,
        type: s_type,
        user_type: s_user_type
        
      }
      
      //메뉴 리스트 호출
      await axiosInstance.get('/admin/user', {params}).then(res => {
        
        setDataStatus(true);

        if(res.data.success){
  
          setUserList(res.data.user_info);
  
        }else{

          alert(res.data.msg);
          navigate('/aoslwj7110/user_list')

        }
  
      })
    }


  }

  //메뉴 상태변경
  const setStatus = (e, id, type, user_type) => {

    
    if(user_type === '카카오' && type === 'admin_yn'){
      alert('SNS 유저는 관리자로 등록할 수 없습니다.');
      return false;
    }

    if(confirm(`${type === 'admin_yn' ? '관리자 여부' : '블랙리스트 여부'}를 수정하시겠습니까?`)){

      let status = true;
  
      let body = {
        value : e.target.value === 'Y' ? 'N' : 'Y',
        id,
        type 
      }
  
      if(status){
        status = false;
        //상태변경 서버
        axiosInstance.post('/admin/user/setStatus', body).then(async(res) => {
    
          alert(res.data.msg);
          status = true;
          if(res.data.success){
            fetchUser();
          }
    
        })
  
      }else{
        alert('처리중입니다.\n잠시만 기다려주세요.')
      }

    }

  }


  return (
    <div className="mt-48 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            회원 관리
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form className='flex justify-center mb-2' method='get' action="./user_list">
              <table className="w-full text-xs text-left rtl:text-right text-gray-500 border border-gray-300 mx-5 my-2">
                <tbody>
                  <tr className="bg-white py-2">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800">
                      회원구분
                    </td>
                    <td>
                      <div className='w-2/3'>
                        <span>
                          <Radio
                            className="h-4 w-4"
                            name='user_type'
                            value="N"
                            defaultChecked={s_user_type === 'N' || s_user_type !== 'SNS'}
                          />일반
                        </span>
                        <span className='ml-5'>
                          <Radio
                            className="h-4 w-4"
                            name='user_type'
                            value="SNS"
                            defaultChecked={s_user_type === 'SNS'}
                          />SNS
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white py-2">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800 w-1/5">
                      검색타입
                    </td>
                    <td className="w-4/5">
                      <div className='w-2/3 mx-2'>
                        <div className='w-1/3'>
                        <select id="type" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        name="type">
                          <option value="email" selected={s_type === "email"}>이메일</option>
                          <option value="name" selected={s_type === "name"}>닉네임</option>
                        </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-white py-2">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap bg-gray-800" >
                      검색어
                    </td>
                    <td className="">
                      <div className='w-2/3 mx-2 flex justify-between'>
                        <div className='w-2/3'>
                          <Input name="keyword" defaultValue={s_keyword}/>
                        </div>
                        <div className='w-1/3 ml-2'>
                          <Button type="submit">검색</Button>
                        </div>
                      </div>                      
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
            
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[ "회원구분", "이메일", "닉네임", "가입일", "수정일", "블랙리스트 여부", '관리자 여부', ""].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {userList.map(
                ({ type, email, name, id, reg_dt, update_dt, black_yn, admin_yn }, key) => {
                  const className = `py-3 px-5 ${
                    key === authorsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={key}>
                    
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`text-xs font-semibold text-blue-gray-600`}
                              >
                                {type}
                              </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`text-xs font-semibold text-blue-gray-600`}
                              >
                                {email}
                              </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`text-xs font-semibold text-blue-gray-600`}
                              >
                                {name}
                              </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className={`text-xs font-semibold text-blue-gray-600`}
                              >
                                {reg_dt}
                              </Typography>
                          </div>
                        </div>
                      </td>        
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className={`text-xs font-semibold text-blue-gray-600`}
                            >
                              {update_dt ? update_dt : '-'}
                            </Typography>
                          </div>
                        </div>
                      </td>        
                      <td className={className}>
                        <Switch
                          value={black_yn}
                          checked={black_yn === 'Y'}
                          onClick={(e) => {setStatus(e, id, 'black_yn', type)}}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                      </td>
                      <td className={className}>
                        <Switch
                          value={admin_yn}
                          checked={admin_yn === 'Y'}
                          onClick={(e) => {setStatus(e, id, 'admin_yn', type)}}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                      </td>
                      <td className={className}>
                        {
                          type === '일반' &&
                          <Link to={`/aoslwj7110/user_list/modify?id=${id}&user_type=${s_user_type}&type=${s_type}&keyword=${s_keyword}`}>
                            <Typography
                              as="a"
                              href="#"
                              className="text-xs font-semibold text-blue-gray-600"
                            >
                              비밀번호 수정
                            </Typography>
                          </Link>
                        }
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
          {
            !dataStatus && (
  
                  <div className='flex justify-center w-full my-10'>
                    <span>
                      <LoadingBar/>
                    </span>
                  </div>
                
            )
          }
          {searchParams.size === 0 && (
            <span className='flex justify-center my-5 font-semibold text-gray-400 text-sm'>
              검색어를 입력해주세요.
            </span>
          )} 
          {dataStatus && userList.length === 0 && searchParams.size !== 0 &&(
            <span className='flex justify-center my-5 font-semibold text-gray-400 text-sm'>
              검색 결과가 없습니다.
            </span>
          )} 
          
        </CardBody>
      </Card>
    </div>
  );
}
export default UserList;

