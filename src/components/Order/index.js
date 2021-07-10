import { useEffect, useState, memo, useMemo, useCallback } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Select from 'react-select';
import { isNull, find, isUndefined } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   faHistory,
   faPlusCircle,
   faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { getAllCustomer } from 'api/customer';
import { getAllBooks } from 'api/book';
import { deleteBillApi, getAllBill, createBill } from 'api/bill';
import { getConfigItem } from 'api/settings';
import SnackBar from 'components/Common/SnackBar';
import DeleteDialog from './DeleteDialog';
import UpdateDialog from './UpdateDialog';
import BookList from './BookList';

function Order() {
   const [customerOption, setCustomerOption] = useState([]);

   const [bookOption, setBookOption] = useState([]);

   const [currentBookList, setCurrentBookList] = useState([]);

   const [selectedBook, setSelectedBook] = useState({});

   const [isDisableAddBook, setIsDisableAddBook] = useState(true);

   const [selectedCustomer, setSelectedCustomer] = useState();

   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

   const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

   const [currentDebt, setCurrentDebt] = useState({});

   const [minBookLeft, setMinBookLeft] = useState({});

   const [maximumDebt, setMaximumDebt] = useState({});

   const [invalidAmount, setInvalidAmount] = useState(false);

   const [openSnackBar, setOpenSnackBar] = useState({
      isOpen: false,
      message: '',
   });

   const [selectedRow, setSelectedRow] = useState({});

   const [bills, setBill] = useState([]);

   const [totalMoney, setTotalMoney] = useState(0);

   const columns = useMemo(
      () => [
         { field: 'id', headerName: 'Bill ID', width: 150 },
         { field: 'name', headerName: 'Customer Name', width: 200 },
         {
            field: 'phone',
            headerName: 'Phone',
            width: 150,
         },
         {
            field: 'date',
            headerName: 'Create Date',
            width: 150,
         },

         {
            field: 'delete',
            headerName: 'Delete',
            width: 130,
            renderCell: params => (
               <button
                  onClick={deleteBill}
                  className="data-grid-btn delete-btn"
               >
                  <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  <span>Delete</span>
               </button>
            ),
         },
         {
            field: 'update',
            headerName: 'Update',
            width: 130,
            renderCell: params => (
               <button onClick={updateBill} className="data-grid-btn edit-btn">
                  <FontAwesomeIcon icon={faHistory}></FontAwesomeIcon>
                  <span>Update</span>
               </button>
            ),
         },
      ],
      []
   );

   const assignCustomerLabel = useCallback(customers => {
      const temp = [];
      for (const el of customers) {
         temp.push({
            label: `${el.name}, Phone: ${el.phoneNumber}, CurrentDebt: ${el.currentDebt}`,
            id: el.id,
            currentDebt: el.currentDebt,
         });
      }
      setCustomerOption(temp);
   }, []);

   const assignBookLabel = useCallback(books => {
      const temp = [];
      for (const el of books) {
         temp.push({
            label: `${el.title}. Amount: ${el.currentAmount}`,
            id: el.id,
            currentAmount: el.currentAmount,
         });
      }
      setBookOption(temp);
   }, []);

   const fetchAllBook = useCallback(async () => {
      const data = await getAllBooks();
      if (isNull(data)) {
         setOpenSnackBar(true);
         return;
      }
      assignBookLabel(data);
   }, [assignBookLabel]);

   const fetchAllCustomer = useCallback(async () => {
      const data = await getAllCustomer();
      if (isNull(data)) {
         setOpenSnackBar(true);
         return;
      }
      assignCustomerLabel(data);
   }, [assignCustomerLabel]);

   const fetchAllBill = useCallback(async () => {
      const data = await getAllBill();
      if (isNull(data)) {
         setOpenSnackBar({
            isOpen: true,
            message: 'Fail to get data',
         });
         return;
      }
      const temp = [];
      for (const bill of data) {
         try {
            temp.push({
               id: bill.id,
               name: bill.customer.name,
               phone: bill.customer.phoneNumber,
               date: Date(bill.dateTime),
               details: bill.details,
            });
         } catch (error) {
            console.log(error);
            continue;
         }
      }
      setBill(temp);
   }, []);

   const getConfig = useCallback(async () => {
      const min = await getConfigItem('MinimumAmountBookLeftAfterSelling');
      const max = await getConfigItem('MaximumDebtCustomer');
      setMinBookLeft(min);
      setMaximumDebt(max);
   }, []);

   const handleCellClick = event => {
      setSelectedRow(event.row);
   };

   const deleteBill = () => {
      setOpenDeleteDialog(true);
   };

   const customerComboboxOnchange = value => {
      setSelectedCustomer(value);
   };

   const bookComboboxOnchange = event => {
      setSelectedBook({ ...selectedBook, ...event });
   };

   const priceChange = event => {
      setSelectedBook({
         ...selectedBook,
         price: parseInt(event.target.value),
      });
      setIsDisableAddBook(false);
   };

   const addBookList = useCallback(() => {
      const foundBook = find(currentBookList, selectedBook);
      if (foundBook) {
         foundBook.amount++;
         const newList = currentBookList.filter(el => el.id !== foundBook.id);
         newList.push(foundBook);
         setCurrentBookList(newList);
         return;
      }
      setCurrentBookList([...currentBookList, selectedBook]);
   }, [currentBookList, selectedBook]);

   const removeBook = useCallback(
      bookName => {
         const newList = currentBookList.filter(el => el.label !== bookName);
         setCurrentBookList(newList);
      },
      [currentBookList]
   );

   const changeQuantity = useCallback(
      event => {
         let amount = parseInt(event.target.value);

         if (amount < 0) {
            amount = 1;
         } else if (
            minBookLeft.status &&
            (selectedBook.currentAmount - amount < minBookLeft.value ||
               isNaN(amount))
         ) {
            setInvalidAmount(true);
            return;
         }
         setInvalidAmount(false);
         setSelectedBook({ ...selectedBook, amount: amount });
      },
      [minBookLeft, selectedBook]
   );

   const closeDeleteDialog = isConfirm => {
      setOpenDeleteDialog(false);
      if (isConfirm) {
         deleteBillApi(selectedRow.id);
         setTimeout(fetchAllBill, 2000);
      }
   };

   const closeUpdateDialog = () => {
      setOpenUpdateDialog(false);
   };

   const addNewBill = () => {
      if (isUndefined(selectedCustomer) && currentBookList.length) {
         setOpenSnackBar({
            isOpen: true,
            message: 'Missing information in bill !!! ',
         });
         return;
      }
      const result = createBill(selectedCustomer, currentBookList);
      if (result) {
         setOpenSnackBar({
            isOpen: true,
            message: 'Action complete loading data...',
         });

         setTimeout(() => {
            fetchAllBill();
         }, 2000);
      }
   };

   const updateBill = () => {
      setOpenUpdateDialog(true);
   };

   useEffect(() => {
      fetchAllCustomer();
      fetchAllBook();
      fetchAllBill();
      getConfig();
   }, [fetchAllBill, fetchAllBook, fetchAllCustomer, getConfig]);

   useEffect(() => {
      let sum = 0;
      for (const el of currentBookList) {
         sum += el.price * el.amount;
      }
      if (maximumDebt.status && sum + currentDebt > maximumDebt.value) {
         setIsDisableAddBook(true);

         setOpenSnackBar({
            isOpen: true,
            message: 'The total price is bigger than customer debt',
         });

         setTimeout(() => {
            setOpenSnackBar({
               isOpen: false,
               message: '',
            });
         }, 3000);
      } else setIsDisableAddBook(false);

      setTotalMoney(sum);
   }, [currentBookList, currentDebt, maximumDebt]);

   useEffect(() => {
      if (!isUndefined(selectedCustomer)) {
         const customer = find(customerOption, { id: selectedCustomer.id });
         setCurrentDebt(customer.currentDebt);
      }
   }, [selectedCustomer, customerOption]);

   return (
      <div className="data-grid">
         <div className="add-area">
            <div>
               <h4 className="main-title">BILL INFO</h4>
               <div className="select-div">
                  <p>Select customer</p>
                  <Select
                     className="select-option"
                     onChange={customerComboboxOnchange}
                     options={customerOption}
                  ></Select>
               </div>
               <div className="select-div">
                  <p>Select book</p>
                  <Select
                     className="select-option"
                     onChange={bookComboboxOnchange}
                     options={bookOption}
                  ></Select>
               </div>
               <div className="select-div">
                  <p>Amount</p>

                  {minBookLeft.status && (
                     <p>Minimum book amount left: {minBookLeft.value}</p>
                  )}

                  <input
                     defaultValue="1"
                     onChange={changeQuantity}
                     type="number"
                  ></input>

                  {invalidAmount && (
                     <p className="error">Invalid book amount </p>
                  )}
               </div>
               <div className="select-div">
                  <p>Price</p>
                  <input
                     onChange={priceChange}
                     className="price-input"
                     type="number"
                  ></input>

                  <button
                     disabled={isDisableAddBook}
                     className="order-button"
                     onClick={addBookList}
                  >
                     Add book
                  </button>
               </div>
               <div className="add-bill-div">
                  <button disabled={isDisableAddBook} onClick={addNewBill}>
                     <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
                     <span>ADD NEW BILL</span>
                  </button>
               </div>
            </div>
            <div className="book-list">
               <h4 className="main-title">CURRENT BOOKS IN BILL</h4>
               {currentBookList.length < 1 ? (
                  <div className="empty-list">
                     <span>Empty</span>
                  </div>
               ) : (
                  <div className="current-book-list">
                     <BookList
                        removeBook={removeBook}
                        books={currentBookList}
                     ></BookList>
                  </div>
               )}
               <p>Total money: {totalMoney}</p>
            </div>
         </div>
         <div className="order-table">
            <h4 className="main-title">ALL BILL</h4>
            <DataGrid
               onCellClick={handleCellClick}
               columns={columns}
               rows={bills}
            ></DataGrid>
         </div>
         <DeleteDialog
            closeDeleteDialog={closeDeleteDialog}
            openDeleteDialog={openDeleteDialog}
         ></DeleteDialog>
         <SnackBar
            openSnackBar={openSnackBar.isOpen}
            message={openSnackBar.message}
         ></SnackBar>
         <UpdateDialog
            books={bookOption}
            billId={selectedRow.id}
            closeUpdateDialog={closeUpdateDialog}
            openUpdateDialog={openUpdateDialog}
         ></UpdateDialog>
      </div>
   );
}

export default memo(Order);
