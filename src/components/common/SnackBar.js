import { Snackbar, Button, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Fragment } from 'react';

export default function SnackBar({ open, message, onClose }) {
   return (
      <div>
         <Snackbar
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'left',
            }}
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            message={message}
            action={
               <Fragment>
                  <Button color="secondary" size="small" onClick={onClose}>
                     ok
                  </Button>
                  <IconButton
                     size="small"
                     aria-label="close"
                     color="inherit"
                     onClick={onClose}
                  >
                     <Close fontSize="small" />
                  </IconButton>
               </Fragment>
            }
         />
      </div>
   );
}
