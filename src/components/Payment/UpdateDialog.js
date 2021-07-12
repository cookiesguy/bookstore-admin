import { memo, useState } from 'react';
import { Dialog } from '@material-ui/core';
import { isInteger } from 'lodash';

function UpdateDialog({ open, close, currentDebt, payment }) {
   const [newMoney, setNewMoney] = useState(payment.money);
   const [error, setError] = useState(false);
   const [disabled, setDisabled] = useState(false);

   const handleInputChange = event => {
      const value = parseInt(event.target.value);
      if (!isInteger(value)) {
         setError(true);
         setDisabled(true);
         setNewMoney('');
         return;
      }
      if (value > currentDebt) {
         setError(true);
         setDisabled(false);
      } else {
         setError(false);
         setNewMoney(value);
      }
   };

   return (
      <Dialog open={open}>
         <div className="update-payment-dialog">
            <div className="input-payment">
               <p>Current customer debt: {currentDebt}</p>
               <h4>New money</h4>
               <input
                  type="number"
                  value={newMoney}
                  onChange={handleInputChange}
               ></input>
            </div>

            {error && (
               <p class="error">Money must be less or equal to customer debt</p>
            )}
            <div className="button-div">
               <button
                  disabled={disabled}
                  className="save-button"
                  onClick={e => close(newMoney, false)}
               >
                  Save
               </button>
               <button
                  className="cancel-button"
                  onClick={e => close(newMoney, true)}
               >
                  Cancel
               </button>
            </div>
         </div>
      </Dialog>
   );
}

export default memo(UpdateDialog);
