import { Dialog } from '@material-ui/core';

export default function DeleteDialog({ openDeleteDialog, closeDeleteDialog }) {
   return (
      <Dialog open={openDeleteDialog}>
         <div className="delete-dialog">
            <h3>Delete this customer</h3>
            <div className="button-div">
               <button
                  className="save-button"
                  onClick={e => closeDeleteDialog(true)}
               >
                  Confirm
               </button>
               <button
                  className="cancel-button"
                  onClick={e => closeDeleteDialog(false)}
               >
                  Cancel
               </button>
            </div>
         </div>
      </Dialog>
   );
}
