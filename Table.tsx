import { Table as TeaTable } from "tea-component/lib/table";
import React, { FC ,useEffect, useState} from "react";
import { EnhancedTableColumn, Paginabale, PageParams } from './utils'
import { Person } from "./person.service";

function Table<T>(props: {
  columns: EnhancedTableColumn<T>[];
  getListFun: (param:PageParams) => Promise<Paginabale<T>>
}) {
  const [isLoading,setIsLoading] = useState(false)
  const [recordData,setRecordData] = useState<Paginabale<T>>()
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  useEffect(() => {
    (async () => {

      setIsLoading(true)
      const result = await props.getListFun({
        pageIndex,
        pageSize
      })
      setIsLoading(false)
      setRecordData(result)
    })();
  },[pageIndex,pageSize]);
  return (
    <TeaTable 
      columns={props.columns} 
      records={recordData ? recordData.list : []} 
      addons={[
        TeaTable.addons.pageable({
            recordCount:recordData ? recordData.total : 0,
            pageIndex,
            pageSize,
            onPagingChange: ({ pageIndex, pageSize }) => {
              setPageIndex(pageIndex || 0);
              setPageSize(pageSize || 20);
            }
          }),
      ]}
    />
  )
}

export default Table