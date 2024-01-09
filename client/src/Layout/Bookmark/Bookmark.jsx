import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { bookMark } from '../../action/userAction';

const Bookmark = ({id}) => {

  const isAuth = useSelector(state => state.user?.isAuth);
  const bookmark = useSelector(state => state.user?.userData.bookmark);
  console.log(bookmark);
  // const [bookmark, setBookmark] = useState([]);
  const [flag, setFlag] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

   //즐겨찾기 불러오기
  async function fetchBookmark(){

    const response = await axiosInstance.get(`/users/bookmark`);
    // setBookmark(response.data.bookmark);

  }

  //즐겨찾기 핸들러
  const bookMarkHandler = (id) => {

    if(flag){

      setFlag(false);

      if(!isAuth){
        if(window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')){
          navigate('/login');
        }
        return false;
      }//end if
  
      
      let body = {
        id: id  
      };

      dispatch(bookMark(body)).then(() => {
        setFlag(true);
        // fetchBookmark();
      });

    }else{
      alert('진행중입니다. 잠시만 기다려주세요.');
    }
  
  }

  useEffect(() => {
    
    // if(isAuth) {
    //   fetchBookmark();
    // }else{
    //   setBookmark([]);
    // }

  }, [dispatch, isAuth])

  return ( 
    <span className={`${bookmark.indexOf(Number(id)) === -1 ? 'text-gray-300' : 'text-yellow-400'} hover:cursor-pointer hover:text-yellow-600 flex-shrink-0 ml-2`} onClick={() => bookMarkHandler(Number(id))}>
      <FontAwesomeIcon icon={faStar} size="lg" />
    </span>
  )
}

export default Bookmark
