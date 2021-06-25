import { useState, useEffect } from 'react';
import { Dialog } from '@material-ui/core';
import Option from './CategoryDialog';
import { validateString, validateNumber } from 'Helper/validate';
import { getConfigItem } from 'api/settings';

export default function AddNewBookDialog(props) {
   const [newBook, setNewBook] = useState({
      category: {
         id: 1,
      },
      amount: '',
      name: '',
      author: '',
   });

   const [minimumImport, setMinimumImport] = useState({
      value: 0,
      status: false,
   });

   const [category, setCategory] = useState([{ name: '' }]);

   const [errorMessage, setErrorMessage] = useState({
      isDisplay: false,
      message: '',
   });

   const changeName = event => {
      setNewBook(prevState => {
         return { ...prevState, name: event.target.value };
      });
   };

   const changeAuthor = event => {
      setNewBook(prevState => {
         return { ...prevState, author: event.target.value };
      });
   };

   const changeAmount = event => {
      setNewBook(prevState => {
         return { ...prevState, amount: event.target.value };
      });
   };

   const changeCategoryId = object => {
      setNewBook(prevState => {
         return { ...prevState, category: object };
      });
   };

   const closeDialog = () => {
      if (
         checkStringValid(newBook.name) &&
         checkStringValid(newBook.author) &&
         checkAmountIsNumber() &&
         checkValidAmount()
      ) {
         setErrorMessage({ isDisplay: false, message: '' });
         props.closeAddDialog(newBook, false);
      }
   };

   const checkValidAmount = () => {
      if (parseInt(newBook.amount) < minimumImport.value) {
         setErrorMessage({
            isDisplay: true,
            message: 'Invalid minium import amount',
         });
         return false;
      }
      setErrorMessage({ isDisplay: false, message: '' });
      return true;
   };

   const checkStringValid = str => {
      if (validateString(str)) {
         setErrorMessage({ isDisplay: false, message: '' });
         return true;
      }
      setErrorMessage({
         isDisplay: true,
         message: 'Invalid book information',
      });
      return false;
   };

   const checkAmountIsNumber = () => {
      if (validateNumber(newBook.amount)) {
         setErrorMessage({ isDisplay: false, message: '' });
         return true;
      } else {
         setErrorMessage({
            isDisplay: true,
            message: 'Amount must be a number',
         });
         return false;
      }
   };

   useEffect(() => {
      setCategory(props.category);
   }, [props.category]);

   useEffect(() => {
      async function fetchConfig() {
         const item = await getConfigItem('MinimumImportBook');
         setMinimumImport(item);
      }
      fetchConfig();
   });

   return category.length > 0 ? (
      <Dialog open={props.openAddDialog}>
         <div className="dialog">
            <h3>Add book</h3>
            <div className="input-info">
               <p className="input-header">Name</p>
               <input onBlur={changeName} className="input"></input>
            </div>

            <div className="input-info">
               <p className="input-header">Author</p>
               <input onBlur={changeAuthor} className="input"></input>
            </div>
            <div className="input-info">
               <p className="input-header">Category</p>
               <Option
                  changeCategoryId={changeCategoryId}
                  currentCategory={category[0].name}
                  category={category}
               ></Option>
            </div>
            {minimumImport.status && (
               <div className="input-info">
                  <p className="input-header">Minimum import amount: </p>
                  <span>{minimumImport.value}</span>
               </div>
            )}

            <div className="input-info">
               <p className="input-header">Amount</p>
               <input
                  onBlur={changeAmount}
                  className="input"
                  type="number"
               ></input>
            </div>
            {errorMessage.isDisplay && (
               <div className="error">{errorMessage.message}</div>
            )}

            <div className="button-div">
               <button onClick={closeDialog} className="save-button">
                  Add
               </button>
               <button
                  onClick={e => props.closeAddDialog(newBook, true)}
                  className="cancel-button"
               >
                  Cancel
               </button>
            </div>
         </div>
      </Dialog>
   ) : (
      <div></div>
   );
}
