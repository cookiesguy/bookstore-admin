import { useState, useEffect, memo, useCallback } from 'react';
import Select from 'react-select';
import { isUndefined, find, isInteger } from 'lodash';
import { Dialog } from '@material-ui/core';
import { getBillDetail } from 'api/bill';
import BookList from './BookList';

function UpdateDialog({
   closeUpdateDialog,
   openUpdateDialog,
   books,
   billId,
   minBookLeft,
   maximumDebt,
   currentDebt,
}) {
   const [bookOption, setBookOption] = useState([]);

   const [currentBookList, setCurrentBookList] = useState([]);

   const [selectedBook, setSelectedBook] = useState({ amount: 1 });

   const [isDisableAddBook, setIsDisableAddBook] = useState(true);

   const [totalMoney, setTotalMoney] = useState(0);
   const [invalidAmount, setInvalidAmount] = useState(false);

   const bookComboboxOnchange = event => {
      setSelectedBook({ ...selectedBook, ...event });
   };

   const priceChange = event => {
      const value = parseInt(event.target.value);
      setSelectedBook({
         ...selectedBook,
         price: parseInt(value),
      });

      if (isInteger(value) && value > 0) setIsDisableAddBook(false);
      else setIsDisableAddBook(true);
   };

   const checkCanAddMore = useCallback(
      bookList => {
         if (bookList.length) {
            let sum = 0;
            for (const el of bookList) {
               sum += el.price * el.amount;
            }
            if (maximumDebt.status && sum + currentDebt > maximumDebt.value) {
               setIsDisableAddBook(true);
               alert('The total price is bigger than customer debt');
               return false;
            }
            setIsDisableAddBook(false);
            setTotalMoney(sum);
            return true;
         }
      },
      [currentDebt, maximumDebt]
   );

   const addBookList = useCallback(() => {
      if (!invalidAmount) {
         const foundBook = find(currentBookList, { id: selectedBook.id });
         if (foundBook) {
            foundBook.amount++;
            foundBook.price = selectedBook.price;
            const newList = currentBookList.filter(
               el => el.id !== foundBook.id
            );
            newList.push(foundBook);
            if (checkCanAddMore(newList)) {
               setCurrentBookList(newList);
            }
            return;
         }
         if (checkCanAddMore([...currentBookList, selectedBook])) {
            setCurrentBookList([...currentBookList, selectedBook]);
         }
      }
   }, [currentBookList, invalidAmount, selectedBook, checkCanAddMore]);

   const removeBook = bookName => {
      const newList = currentBookList.filter(el => el.label !== bookName);
      setCurrentBookList(newList);
   };

   const changeQuantity = useCallback(
      event => {
         let amount = parseInt(event.target.value);

         if (!isInteger(amount) || amount < 0) {
            setInvalidAmount(true);
            return;
         }
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

   const fetchBillDetail = useCallback(async () => {
      try {
         const data = await getBillDetail(billId);

         const temp = [];

         for (const el of data) {
            temp.push({
               id: el.book.id,
               billDetailId: el.billDetailId,
               label: el.book.title,
               price: el.price,
               amount: el.amount,
            });
         }
         setCurrentBookList(temp);
      } catch (error) {}
   }, [billId]);

   useEffect(() => {
      if (!isUndefined(billId)) fetchBillDetail();
   }, [billId, fetchBillDetail]);

   useEffect(() => {
      setBookOption(books);
   }, [books]);

   return (
      <Dialog open={openUpdateDialog}>
         <div className="update-bill-dialog">
            <h4>Update bill</h4>
            <div>
               <div className="select-div-dialog">
                  <p>Select book</p>
                  <Select
                     className="select-option"
                     onChange={bookComboboxOnchange}
                     options={bookOption}
                  ></Select>
               </div>
               <div className="select-div-dialog">
                  {minBookLeft.status && (
                     <p>Minimum book left after sell: {minBookLeft.value}</p>
                  )}
                  <p>Amount</p>
                  <input
                     defaultValue="1"
                     onChange={changeQuantity}
                     type="number"
                  ></input>
                  {invalidAmount && (
                     <p className="error">Invalid book amount </p>
                  )}
               </div>
               <div className="select-div-dialog">
                  {maximumDebt.status && (
                     <p>Maximum customer debt: {maximumDebt.value}</p>
                  )}
                  <p>Current debt: {currentDebt}</p>
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
            </div>
            <div className="book-list-dialog">
               <h4>CURRENT BOOKS IN BILL</h4>
               {currentBookList.length < 1 ? (
                  <div className="empty-list-dialog">
                     <span>Empty</span>
                  </div>
               ) : (
                  <div className="current-book-list">
                     <BookList
                        removeBook={removeBook}
                        books={currentBookList}
                     ></BookList>
                     <p>Total money: {totalMoney}</p>
                  </div>
               )}
            </div>

            <div className="button-div-order">
               <button
                  className="save-button"
                  disabled={isDisableAddBook}
                  onClick={e => closeUpdateDialog(currentBookList, false)}
               >
                  Update
               </button>
               <button
                  className="cancel-button"
                  onClick={e => closeUpdateDialog(null, true)}
               >
                  Cancel
               </button>
            </div>
         </div>
      </Dialog>
   );
}

export default memo(UpdateDialog);
