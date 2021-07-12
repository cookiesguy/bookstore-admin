import { Dialog } from '@material-ui/core';

export default function ConfirmDialog({ open, close, message }) {
   return (
      <Dialog open={open}>
         <div className="delete-dialog">
            <h3>{message}</h3>
            <div className="button-div">
               <button className="save-button" onClick={e => close(true)}>
                  Confirm
               </button>
               <button className="cancel-button" onClick={e => close(false)}>
                  Cancel
               </button>
            </div>
         </div>
      </Dialog>
   );
}
