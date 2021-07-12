import { useState, useEffect } from 'react';
import { Dialog } from '@material-ui/core';
import {
   validateEmail,
   validateString,
   validatePhoneNumber,
} from 'Helper/validate';

export default function EditDiaLog({
   openEditDialog,
   closeEditDialog,
   customer,
}) {
   const [editCustomer, setEditCustomer] = useState({});
   const [errorMessage, setErrorMessage] = useState({
      isDisplay: false,
      message: '',
   });

   const changeAddress = event => {
      if (event.target.value === '')
         setEditCustomer(prevState => {
            return {
               ...prevState,
               address: customer.address,
            };
         });
      else
         setEditCustomer(prevState => {
            return {
               ...prevState,
               address: event.target.value,
            };
         });
   };

   const changeName = event => {
      if (event.target.value === '')
         setEditCustomer(prevState => {
            return {
               ...prevState,
               name: customer.name,
            };
         });
      else
         setEditCustomer(prevState => {
            return {
               ...prevState,
               name: event.target.value,
            };
         });
   };

   const changePhoneNumber = event => {
      if (event.target.value === '')
         setEditCustomer(prevState => {
            return {
               ...prevState,
               phoneNumber: customer.phoneNumber,
            };
         });
      else
         setEditCustomer(prevState => {
            return {
               ...prevState,
               phoneNumber: event.target.value,
            };
         });
   };

   const changeEmail = event => {
      if (event.target.value === '')
         setEditCustomer(prevState => {
            return {
               ...prevState,
               email: customer.email,
            };
         });
      else
         setEditCustomer(prevState => {
            return {
               ...prevState,
               email: event.target.value,
            };
         });
   };

   const checkValidAddressAndName = () => {
      if (
         validateString(editCustomer.name) ||
         validateString(editCustomer.address)
      ) {
         setErrorMessage({ isDisplay: false, message: '' });
         return true;
      }
      setErrorMessage({
         isDisplay: true,
         message: 'Invalid name or address',
      });
      return false;
   };

   const checkValidEmail = () => {
      if (validateEmail(editCustomer.email)) {
         setErrorMessage({ isDisplay: false, message: '' });
         return true;
      }
      setErrorMessage({ isDisplay: true, message: 'Invalid email address' });
   };

   const checkValidPhoneNumber = () => {
      if (validatePhoneNumber(editCustomer.phoneNumber)) {
         setErrorMessage({ isDisplay: false, message: '' });
         return true;
      }
      setErrorMessage({ isDisplay: true, message: 'Invalid phone number' });
   };

   const closeDialog = () => {
      if (
         checkValidEmail() &&
         checkValidPhoneNumber() &&
         checkValidAddressAndName()
      ) {
         closeEditDialog(editCustomer, false);
      }
   };

   useEffect(() => {
      setEditCustomer(customer);
   }, [customer]);

   return (
      <Dialog open={openEditDialog}>
         <div className="dialog">
            <h3>Edit customer information</h3>
            <div className="input-info">
               <p className="input-header">Name</p>
               <input
                  onChange={changeName}
                  className="input"
                  placeholder={customer.name}
               ></input>
            </div>
            <div className="input-info">
               <p className="input-header">Address</p>
               <input
                  onChange={changeAddress}
                  className="input"
                  placeholder={customer.address}
               ></input>
            </div>
            <div className="input-info">
               <p className="input-header">Email</p>
               <input
                  onChange={changeEmail}
                  className="input"
                  placeholder={customer.email}
               ></input>
            </div>
            <div className="input-info">
               <p className="input-header">Phone</p>
               <input
                  onChange={changePhoneNumber}
                  className="input"
                  placeholder={customer.phoneNumber}
               ></input>
            </div>
            {errorMessage.isDisplay && (
               <div className="error">{errorMessage.message}</div>
            )}
            <div className="button-div">
               <button
                  className="save-button"
                  onClick={e => closeDialog(editCustomer, false)}
               >
                  Save
               </button>
               <button
                  className="cancel-button"
                  onClick={e => closeEditDialog(null, true)}
               >
                  Cancel
               </button>
            </div>
         </div>
      </Dialog>
   );
}
