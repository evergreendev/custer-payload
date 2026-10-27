"use client"
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react'


const Pagination = ({totalPages}: { totalPages: number }) => {
  const searchParams = useSearchParams();
  const currPage = searchParams.get("page") || "1";
  const pageArr: any[] = [];
  const pathname = usePathname();
  const {replace} = useRouter();
  function handleClick(page: number) {
    const params = new URLSearchParams(searchParams);

    params.set('page', page.toString());

    replace(`${pathname}?${params.toString()}`,{scroll: false})
  }
  useEffect(() => {
    if (totalPages < parseInt(currPage)){
      handleClick(totalPages === 0 ? 1 : totalPages)
    }
  }, [currPage, totalPages])

  for (let i = 0; i < totalPages; i++) {
    pageArr.push((i + 1).toString());
  }



  if (pageArr.length <= 1) return <></>;

  const buttonArr = pageArr.map((page: any, index) => {
    const currPageNumber = parseInt(currPage);
    if(index === 0
      || index === totalPages-1
      || (index+1 > currPageNumber && index - 10 < currPageNumber)
      || (index+1 < currPageNumber && index + 10 > currPageNumber)
      || index + 1 === currPageNumber
    ){
      return <button key={page} onClick={() => handleClick(page)}
                     className={`bg-slate-500 text-white p-2 w-10
                       ${currPage === page ? "bg-slate-800" : ""}
                       `}>{page}</button>
    } else{
      return null;
    }

  })

  return <div>
    <button className="pr-2 w-14" onClick={() => handleClick(1)}>{
      currPage === "1" ? <span className="font-bold">First</span> : "First"
    }</button>
    {
      <button className="px-1 size-6" disabled={currPage === "1"}
              aria-label="Previous page"
              onClick={() => handleClick(Math.max((parseInt(currPage) - 1), 1))}>
        {currPage === "1" ? "" : <ChevronLeft className="inline-block size-4" strokeWidth={1} aria-hidden="true" />}
      </button>
    }
    {buttonArr}
    {
      <button className="px-1 size-6"
              aria-label="Next page"
              disabled={parseInt(currPage) === totalPages}
              onClick={() => handleClick(Math.min((parseInt(currPage) + 1), totalPages))}>
        {parseInt(currPage) === totalPages ? "" : <ChevronRight className="inline-block size-4" strokeWidth={1} aria-hidden="true" />}
      </button>
    }
    <button className="pl-2 w-14" onClick={() => handleClick(totalPages)}>{
      parseInt(currPage) === totalPages ? <span className="font-bold">Last</span> : "Last"
    }</button>
  </div>;
}

export default Pagination;
