import React from 'react'

const index = ({loader}) => {

  if(loader){
    //stockList 로딩중...
    return (
      <div ref={loader}>
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-t-blue-500"></div>
        </div>
      </div>
    )
  }else{
    //그외
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-t-blue-500"></div>
      </div>
    )
  }
}

export default index
