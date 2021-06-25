import Snackbar from '@material-ui/core/Snackbar';
import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
export default function SnackBar({ openSnackBar, message }) {
   const [open, setOpen] = React.useState(false);

   const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
         return;
      }
      setOpen(false);
   };

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
            onClose={handleClose}
            message={message}
            action={
               <React.Fragment>
                  <Button color="secondary" size="small" onClick={handleClose}>
                     OK
                  </Button>
                  <IconButton
                     size="small"
                     aria-label="close"
                     color="inherit"
                     onClick={handleClose}
                  >
                     <CloseIcon fontSize="small" />
                  </IconButton>
               </React.Fragment>
            }
         />
      </div>
   );
}
