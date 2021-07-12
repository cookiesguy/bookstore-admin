import { useEffect, useState, useCallback } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { getBookReport, getDebtReport } from 'api/statistic';
import Loading from 'components/Common/Loading';

import RenderCellExpand from 'components/Common/RenderCellExpand';

const bookReportCol = [
   { field: 'id', headerName: 'ID', width: 100 },
   { field: 'bookId', headerName: 'Book ID', width: 150 },

   {
      field: 'name',
      headerName: 'Book Name',
      width: 250,
      renderCell: RenderCellExpand,
   },

   {
      field: 'date',
      headerName: 'Effect Date',
      width: 150,
      renderCell: RenderCellExpand,
   },

   {
      field: 'before',
      headerName: 'Before Amount',
      width: 180,
      type: 'number',
   },
   {
      field: 'after',
      headerName: 'After Amount',
      width: 180,
      type: 'number',
   },
   {
      field: 'change',
      headerName: 'Change Amount',
      width: 180,
      type: 'number',
   },
];

const debtReportCol = [
   { field: 'id', headerName: 'ID', width: 100 },
   { field: 'customerId', headerName: 'Customer ID', width: 150 },

   {
      field: 'name',
      headerName: 'Customer Name',
      width: 250,
      renderCell: RenderCellExpand,
   },

   {
      field: 'currentDebt',
      headerName: 'Current Debt',
      width: 150,
      renderCell: RenderCellExpand,
   },

   {
      field: 'date',
      headerName: 'Effect Date',
      width: 150,
      renderCell: RenderCellExpand,
   },

   {
      field: 'before',
      headerName: 'Before Debt',
      width: 180,
      type: 'number',
   },
   {
      field: 'after',
      headerName: 'After Debt',
      width: 180,
      type: 'number',
   },
   {
      field: 'change',
      headerName: 'Change Debt',
      width: 180,
      type: 'number',
   },
];

export default function Statistic() {
   const [loadingBookReport, setLoadingBookReport] = useState(false);

   const [loadingBill, setLoadingBill] = useState(false);

   const [bookReport, setBookReport] = useState([]);

   const [debtReport, setDebtReport] = useState([]);

   const [firstDate, setFirstDate] = useState(new Date());

   const [secondDate, setSecondDate] = useState(new Date());

   const [bookReportDate, setBookReportDate] = useState({
      month: 0,
      year: 0,
   });

   const [debtReportDate, setDebtReportDate] = useState({
      month: 0,
      year: 0,
   });

   const handleBookDateChange = value => {
      const date = new Date(value);
      setBookReportDate({
         month: date.getMonth() + 1,
         year: date.getFullYear(),
      });
      setFirstDate(date);
   };

   const handleDebtDateChange = value => {
      const date = new Date(value);
      setDebtReportDate({
         month: date.getMonth() + 1,
         year: date.getFullYear(),
      });
      setSecondDate(date);
   };

   const refactorBookReport = useCallback(data => {
      let temp = [];
      try {
         let i = 0;
         for (const item of data) {
            temp.push({
               id: i++,
               bookId: item.book.id,
               name: item.book.title,
               date: item.date,
               before: item.before,
               after: item.after,
               change: item.changeAmount,
            });
         }
      } catch (error) {}
      return temp;
   }, []);

   const refactorDebtReport = useCallback(data => {
      let temp = [];
      let i = 0;
      for (const item of data) {
         temp.push({
            id: i++,
            customerId: item.customer.id,
            name: item.customer.name,
            currentDebt: item.customer.currentDebt,
            date: item.date,
            before: item.before,
            after: item.after,
            change: item.changeAmount,
         });
      }
      return temp;
   }, []);

   const getNewBookReport = () => {
      setLoadingBookReport(true);
      fetchBookReport(bookReportDate.month, bookReportDate.year);
   };
   const getNewDebtReport = () => {
      setLoadingBill(true);
      fetchDebtReport(debtReportDate.month, debtReportDate.year);
   };

   const fetchBookReport = useCallback(
      async (month, year) => {
         const data = await getBookReport(month, year);
         const rowData = refactorBookReport(data);
         setBookReport(rowData);
         setLoadingBookReport(false);
      },
      [refactorBookReport]
   );

   const fetchDebtReport = useCallback(
      async (month, year) => {
         const data = await getDebtReport(month, year);
         const rowData = refactorDebtReport(data);
         setDebtReport(rowData);
         setLoadingBill(false);
      },
      [refactorDebtReport]
   );

   useEffect(() => {
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      setLoadingBookReport(true);
      setLoadingBill(true);
      fetchBookReport(month, year);
      fetchDebtReport(month, year);
   }, [fetchBookReport, fetchDebtReport]);

   return (
      <div className="data-grid">
         <div>
            <div className="date-picker">
               <span>Choose time:</span>
               <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                     variant="inline"
                     openTo="year"
                     value={firstDate}
                     views={['year', 'month']}
                     onChange={handleBookDateChange}
                  />
               </MuiPickersUtilsProvider>
               <Button
                  onClick={getNewBookReport}
                  variant="contained"
                  color="primary"
               >
                  get data
               </Button>
            </div>
            <h4 className="main-title">Book report</h4>
            <div className="table">
               {loadingBookReport && <Loading></Loading>}
               <DataGrid columns={bookReportCol} rows={bookReport}></DataGrid>
            </div>
            <div className="date-picker">
               <span>Choose time:</span>
               <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                     variant="inline"
                     openTo="year"
                     views={['year', 'month']}
                     value={secondDate}
                     onChange={handleDebtDateChange}
                  />
               </MuiPickersUtilsProvider>
               <Button
                  onClick={getNewDebtReport}
                  variant="contained"
                  color="primary"
               >
                  get data
               </Button>
            </div>
            <h4 className="main-title">Debt report</h4>
            <div className="table">
               <div className="table">
                  {loadingBill && <Loading></Loading>}
                  <DataGrid
                     columns={debtReportCol}
                     rows={debtReport}
                  ></DataGrid>
               </div>
            </div>
         </div>
      </div>
   );
}
