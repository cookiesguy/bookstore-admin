import Snackbar from '@material-ui/core/Snackbar';
import React, { useEffect } from 'react';

export default function SnackBar({ openSnackBar, message, isEnableClose }) {
   const [open, setOpen] = React.useState(false);

   useEffect(() => {
      setOpen(openSnackBar);
   }, [openSnackBar]);

   return (
      <div>
         <Snackbar
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'left',
            }}
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            message={message}
         />
      </div>
   );
}
