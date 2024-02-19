
const getStartRow = (pg, pp) => {

  let startRow = 0;

  startRow = (pg  * pp) - pp + 1;

  return startRow;

}

//페이징 
const getEndRow = (pg, pp) => {

  let endRow = 0;
  endRow = pg * pp;
  return endRow;

}
