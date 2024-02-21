import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Switch,
  Button,
} from "@material-tailwind/react";
import { Bars2Icon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { authorsTableData } from "@/data";
import { useEffect, useState } from 'react';
import DefaultPagination from '@/layouts/defaultPagination';
import axiosInstance from '@/utils/axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LoadingBar from '@/layouts/loadingBar';

//테이블 로우 드래그앤드롭 설정
const ItemType = 'ROW';

const DraggableRow = ({ id, index, moveRow, children, use_yn }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <tr
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      key={index}
      className={`${use_yn === 'Y' ? '' : 'bg-gray-200'}`}
    >
      {children}
    </tr>
  );
};

export function AdminMenu({fetchRoutes}) {

  const [searchParams, setSearchParams] = useSearchParams();
  const pCode = searchParams.get('p_code');
  const pp = searchParams.get('pp') ? searchParams.get('pp') : 10;
  const pg = searchParams.get('pg') ? searchParams.get('pg') : 1;
  const [menuList, setMenuList] = useState([]);
  const [parentName, setParentName] = useState('최상위');
  const navigate = useNavigate();
  const [totalRowNum, setTotalRowNum] = useState(0);
  const [dataStatus, setDataStatus] = useState(true);

  useEffect(() => {

    fetchMenuList();

  }, [pCode])
  
  const fetchMenuList = async() => {

    let params = {
      parentCode : pCode,
      pp,
      pg
    }
    if(dataStatus){

      setDataStatus(false);


      //메뉴 리스트 호출
      await axiosInstance.get('/admin/admin_menu/adminMenuList', {params}).then(res => {
  
        if(res.data.success){
  
          setMenuList(res.data.menu_list);
          setParentName(res.data.p_name);
          setTotalRowNum(res.data.totalRowNum);
  
          fetchRoutes();

          setDataStatus(true);

        }else{
  
          alert(res.data.msg);
          navigate('/aoslwj7110/admin_menu');
        }
  
      })
    }

    

  }

  //메뉴 상태변경
  const setStatus = (e, menu_code) => {

    //관리자 메뉴는 막기
    if(menu_code === '001'){
      
      alert('관리자 메뉴는 미사용 처리를 할 수 없습니다.');
      e.preventDefault();

      return false;
    }//end if

    let body = {
      value : e.target.value === 'Y' ? 'N' : 'Y',
      menu_code 
    }

    //상태변경 서버
    axiosInstance.post('/admin/admin_menu/setAdminMenuStatus', body).then(async(res) => {

      alert(res.data.msg);

      if(res.data.result){
        //성공이면 데이터 reload
        await fetchMenuList();
      }

    })

  }

  const goNextDepth = (menu_code) => {

    if(menu_code.length > 3){
      alert('더 이상 메뉴를 생성할 수 없습니다.');
      return false;
    }

    navigate(`/aoslwj7110/admin_menu?p_code=${menu_code}`)
  }

  const moveRow = (fromIndex, toIndex) => {
    const updatedRows = [...menuList];
    const [movedRow] = updatedRows.splice(fromIndex, 1);
    updatedRows.splice(toIndex, 0, movedRow);
    setMenuList(updatedRows);

  };
  
  //순서변경 적용
  const setOrder = () => {

    let body = {

      menu_list: menuList,
      parentCode: pCode
    }

    axiosInstance.post('/admin/admin_menu/setAdminMenuOrder', body).then(res => {

      alert(res.data.msg);

      if(res.data.success){

        fetchMenuList();

      }

    });

  }
  
  const pagingFunction = (pg) => {

    const currentParams = { ...Object.fromEntries(searchParams) };

    // 새로운 값을 추가
    currentParams.pg = pg;

    // 업데이트된 search parameters를 URL에 반영
    setSearchParams(currentParams);

  }

  if(!dataStatus){
    return (
      <div className="mt-48 mb-8 flex flex-col gap-12 ">
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
              <Typography variant="h6" color="white">
                관리자 메뉴 관리
              </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <LoadingBar/>
          </CardBody>
        </Card>
      </div>
    )
  }


  return (
    <div className="mt-48 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            관리자 메뉴 관리 ({parentName})
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {
            parentName !== '최상위' && (
              <Link to="/aoslwj7110/admin_menu">
                <div className='flex justify-left cursor-pointer hover:underline'>
                  <ArrowLeftIcon className="w-4 h-4 text-inherit ml-5" /> 
                  <span className='text-sm ml-2'> 최상위</span>
                </div>
              </Link>
            )
          }
            <DndProvider backend={HTML5Backend}>

          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["", "메뉴코드", "메뉴명", "등록일", "수정일", "사용여부", ""].map((el) => (
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
          
              {menuList.map(
                ({ menu_code, name, reg_dt, update_dt, use_yn }, key) => {
                  const className = `py-3 px-5 ${
                    key === authorsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <DraggableRow
                      key={key}
                      id={key}
                      index={key}
                      use_yn={use_yn}
                      moveRow={moveRow}
                    >
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Bars2Icon className="w-5 h-5 text-inherit"/>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                              >
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
                              className={`text-xs font-semibold text-blue-gray-600 cursor-pointer hover:underline`}
                              onClick={() => goNextDepth(menu_code)}
                            >
                              {menu_code}
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
                              className={`text-xs font-semibold text-blue-gray-600 cursor-pointer hover:underline`}
                              onClick={() => goNextDepth(menu_code)}
                            >
                              {name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {reg_dt}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {update_dt ? update_dt : '-'}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Switch
                          value={use_yn}
                          checked={use_yn === 'Y'}
                          onClick={(e) => {setStatus(e, menu_code)}}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                      </td>
                      <td className={className}>
                        <Link to={`/aoslwj7110/admin_menu/modify?act=U&code=${menu_code}&p_code=${pCode ? pCode : ''}`}>
                          <Typography
                            as="a"
                            href="#"
                            className="text-xs font-semibold text-blue-gray-600"
                          >
                            수정
                          </Typography>
                        </Link>
                      </td>

                    </DraggableRow>
                  
              
                  
                  );
                }
              )}
            </tbody>
          </table>
            </DndProvider>
          <div className='flex justify-end mt-5 mr-8'>
            <Button size="md" className='mr-4' onClick={() => {setOrder()}}>
                순서 변경적용
            </Button>
            <Link to={`/aoslwj7110/admin_menu/modify?act=I&code=${pCode ? pCode : ''}&p_code=${pCode ? pCode : ''}`}>
              <Button size="md" color='blue'>
                  등록
              </Button>
            </Link>
          </div>
          <div className='flex items-center justify-center mt-5'>
            <DefaultPagination prn_Per_cnt={pp} currentPage={pg} totalRowNum={totalRowNum} pagingFunction={pagingFunction}/>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


export default AdminMenu;
