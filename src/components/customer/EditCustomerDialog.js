import { useState, useEffect } from 'react';
import { Dialog } from '@material-ui/core';
import {
   validateEmail,
   validateString,
   validatePhoneNumber,
} from 'helper/validate';

export default function EditDiaLog(props) {
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
               address: props.customer.address,
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
               name: props.customer.name,
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
               phoneNumber: props.customer.phoneNumber,
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
               email: props.customer.email,
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
         props.closeEditDialog(editCustomer, false);
      }
   };

   useEffect(() => {
      setEditCustomer(props.customer);
   }, [props.customer]);

   return (
      <Dialog open={props.openEditDialog}>
         <div className="dialog">
            <h3>Edit customer information</h3>
            <div className="input-info">
               <p className="input-header">Name</p>
               <input
                  onBlur={changeName}
                  className="input"
                  placeholder={props.customer.name}
               ></input>
            </div>
            <div className="input-info">
               <p className="input-header">Address</p>
               <input
                  onBlur={changeAddress}
                  className="input"
                  placeholder={props.customer.address}
               ></input>
            </div>
            <div className="input-info">
               <p className="input-header">Email</p>
               <input
                  onBlur={changeEmail}
                  className="input"
                  placeholder={props.customer.email}
               ></input>
            </div>
            <div className="input-info">
               <p className="input-header">Phone</p>
               <input
                  onBlur={changePhoneNumber}
                  className="input"
                  placeholder={props.customer.phoneNumber}
               ></input>
            </div>
            {errorMessage.isDisplay && (
               <div className="error">{errorMessage.message}</div>
            )}
            <div className="button-div">
               <button className="save-button" onClick={closeDialog}>
                  Save
               </button>
               <button
                  className="cancel-button"
                  onClick={e => props.closeEditDialog(null, true)}
               >
                  Cancel
               </button>
            </div>
         </div>
      </Dialog>
   );
}
