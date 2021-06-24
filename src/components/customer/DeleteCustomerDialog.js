import { Dialog } from '@material-ui/core';

export default function DeleteDialog(props) {
   return (
      <Dialog open={props.openDeleteDialog}>
         <div className="delete-dialog">
            <h3>Delete this customer</h3>
            <div className="button-div">
               <button
                  className="save-button"
                  onClick={e => props.closeDeleteDialog(true)}
               >
                  Confirm
               </button>
               <button
                  className="cancle-button"
                  onClick={e => props.closeDeleteDialog(false)}
               >
                  Cancel
               </button>
            </div>
         </div>
      </Dialog>
   );
}
