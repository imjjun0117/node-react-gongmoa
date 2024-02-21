import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const PAGE_GROUP_SIZE = 5;

export function DefaultPagination({prn_Per_cnt, currentPage, totalRowNum, pagingFunction}) {

  const [active, setActive] = React.useState(currentPage);
  const finalPage = Math.ceil(totalRowNum / prn_Per_cnt); // 마지막 페이지
  const rest = totalRowNum % prn_Per_cnt; // 남은 데이터 갯수
  const virtualStartPage = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  let virtualEndPage = 0;

  if((virtualStartPage + (PAGE_GROUP_SIZE - 1)) < finalPage){
    virtualEndPage = virtualStartPage + ( PAGE_GROUP_SIZE - 1) ;
  }else{
    virtualEndPage = finalPage;
  }

  const getItemProps = (index) =>
    ({
      variant: active === index ? "filled" : "text",
      color: "gray",
      onClick: () => {
        setActive(index);
        pagingFunction(index);
      },
    });

  const next = () => {
    if (virtualEndPage === finalPage) return;

    setActive(virtualStartPage + 5);
    pagingFunction(virtualStartPage + 5);
  };

  const prev = () => {
    if (currentPage === 1) return;


    console.log( Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) == 0);

    if( Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) == 0){
      setActive(1);
      pagingFunction(1);

    }else{
      setActive(virtualStartPage - 5);
      pagingFunction(virtualStartPage - 5);
    }

  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant={"text"}
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> 이전
      </Button>
      <div className="flex items-center gap-2">
        {[...Array(virtualEndPage - virtualStartPage + 1)].map((_, index) => (
          <IconButton key={virtualStartPage + index} variant= {active === index ? "filled" : "text"} {...getItemProps(virtualStartPage + index)}>
            {virtualStartPage + index}
          </IconButton>
        ))}
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        disabled={active === 5}
      >
        다음
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default DefaultPagination;