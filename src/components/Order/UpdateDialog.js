/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { isUndefined } from 'lodash';
import { Dialog } from '@material-ui/core';
import { getBillDetail } from 'api/bill';
import BookList from './BookList';

export default function UpdateDialog({
   closeUpdateDialog,
   openUpdateDialog,
   books,
   billId,
}) {
   const [bookOption, setBookOption] = useState([]);

   const [currentBookList, setCurrentBookList] = useState([]);

   const [selectedBook, setSelectedBook] = useState({ amount: 1 });

   const [isDisableAddBook, setIsDisableAddBook] = useState(true);

   const [totalMoney, setTotalMoney] = useState(0);

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

   const addBookList = () => {
      setCurrentBookList([...currentBookList, selectedBook]);
   };

   const removeBook = bookName => {
      const newList = currentBookList.filter(el => el.label !== bookName);
      setCurrentBookList(newList);
   };

   const changeQuantity = event => {
      let amount = parseInt(event.target.value);
      if (amount < 0) {
         amount = 1;
      }
      setSelectedBook({ ...selectedBook, amount: amount });
   };

   async function fetchBillDetail() {
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
   }

   useEffect(() => {
      if (!isUndefined(billId)) fetchBillDetail();
   }, [billId]);

   useEffect(() => {
      let sum = 0;
      for (const el of currentBookList) {
         sum += el.price * el.amount;
      }
      setTotalMoney(sum);
   }, [currentBookList]);

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
                  <p>amount</p>
                  <input
                     defaultValue="1"
                     onChange={changeQuantity}
                     type="number"
                  ></input>
               </div>
               <div className="select-div-dialog">
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
                  onClick={e => closeUpdateDialog()}
               >
                  Update
               </button>
               <button
                  className="cancel-button"
                  onClick={e => closeUpdateDialog()}
               >
                  Cancel
               </button>
            </div>
         </div>
      </Dialog>
   );
}
