import { useState, useCallback, useEffect, memo, useMemo } from 'react';
import { isNil, isInteger, find, isUndefined } from 'lodash';
import Select from 'react-select';
import cache from 'memory-cache';
import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faTrash } from '@fortawesome/free-solid-svg-icons';
import SnackBar from 'components/Common/SnackBar';
import Loading from 'components/Common/Loading';
import ConfirmDialog from 'components/Common/ConfirmDialog';
import RenderCellExpand from 'components/Common/RenderCellExpand';
import { getAllCustomer } from 'api/customer';
import {
   addNewPaymentApi,
   getAllPayment,
   deletePayment,
   updatePayment,
} from 'api/payment';
import { time } from 'Config/cache';
import UpdateDialog from './UpdateDialog';

function Payment() {
   const [customerOption, setCustomerOption] = useState([]);

   const [openSnackBar, setOpenSnackBar] = useState({
      isOpen: false,
      message: '',
   });

   const [selectedCustomer, setSelectedCustomer] = useState(null);

   const [money, setMoney] = useState(0);

   const [currentDebt, setCurrentDebt] = useState(0);

   const [rowData, setRowData] = useState([]);

   const [selectedRow, setSelectedRow] = useState({});

   const [loading, setLoading] = useState(false);

   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

   const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

   const openDeleteDialogAction = useCallback(() => {
      setOpenDeleteDialog(true);
   }, []);

   const openUpdateDialogAction = useCallback(
      params => {
         const customer = find(customerOption, { id: params.row.customerId });
         if (isUndefined(customer)) return;
         setCurrentDebt(customer.currentDebt);
         setOpenUpdateDialog(true);
      },
      [customerOption]
   );

   const columns = useMemo(
      () => [
         { field: 'id', headerName: 'ID', width: 150 },
         {
            field: 'customerId',
            headerName: 'CustomerID',
            width: 150,
         },
         { field: 'name', headerName: 'Customer Name', width: 200 },
         {
            field: 'phone',
            headerName: 'Phone',
            width: 150,
         },
         {
            field: 'date',
            headerName: 'Create Date',
            width: 150,
            renderCell: RenderCellExpand,
         },

         {
            field: 'money',
            headerName: 'Money',
            width: 150,
            type: 'number',
         },

         {
            field: 'delete',
            headerName: 'Delete',
            width: 130,
            renderCell: params => (
               <button
                  onClick={openDeleteDialogAction}
                  className="data-grid-btn delete-btn"
               >
                  <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  <span>Delete</span>
               </button>
            ),
         },
         {
            field: 'update',
            headerName: 'Update',
            width: 130,
            renderCell: params => (
               <button
                  onClick={e => openUpdateDialogAction(params)}
                  className="data-grid-btn edit-btn"
               >
                  <FontAwesomeIcon icon={faHistory}></FontAwesomeIcon>
                  <span>Update</span>
               </button>
            ),
         },
      ],
      [openUpdateDialogAction, openDeleteDialogAction]
   );

   const assignCustomerLabel = useCallback(customers => {
      const temp = [];
      for (const el of customers) {
         temp.push({
            label: `${el.name}, Phone: ${el.phoneNumber}, CurrentDebt: ${el.currentDebt}`,
            id: el.id,
            currentDebt: el.currentDebt,
         });
      }
      setCustomerOption(temp);
   }, []);

   const fetchAllCustomer = useCallback(async () => {
      let data;
      const cacheData = cache.get('api/customer/payment');
      if (cacheData) {
         data = cacheData;
      } else {
         data = await getAllCustomer();
         cache.put('api/customer/payment', data, 10000);
      }
      if (isNil(data)) {
         setOpenSnackBar({ isOpen: true, message: 'Fail to get data' });
         return;
      } else assignCustomerLabel(data);
   }, [assignCustomerLabel]);

   const refactorPayment = useCallback(data => {
      let rowData = [];
      for (const item of data) {
         rowData.push({
            id: item.receiptID,
            customerId: item.customer.id,
            name: item.customer.name,
            phone: item.customer.phoneNumber,
            date: item.dateTime,
            money: item.moneyAmount,
         });
      }
      return rowData;
   }, []);

   const fetchAllPayment = useCallback(async () => {
      setLoading(true);
      let data;
      const cacheData = cache.get('api/payment');
      if (cacheData) {
         data = cacheData;
      } else {
         data = await getAllPayment();
         cache.put('api/payment', data, time);
      }
      if (isNil(data)) {
         setOpenSnackBar({ isOpen: true, message: 'Fail to get data' });
         setLoading(false);
         return;
      }
      const rowData = refactorPayment(data);
      setLoading(false);
      setRowData(rowData);
   }, [refactorPayment]);

   const startAddNewPayment = useCallback(async () => {
      setLoading(true);

      const result = await addNewPaymentApi(selectedCustomer.id, money);
      if (result) {
         cache.clear();

         fetchAllPayment();
         fetchAllCustomer();
      } else {
         setOpenSnackBar({
            isOpen: true,
            message: 'Fail to add data. System error',
         });
         setLoading(false);
      }
   }, [selectedCustomer, money, fetchAllPayment, fetchAllCustomer]);

   const startDeletePayment = useCallback(async () => {
      setLoading(true);

      const result = await deletePayment(selectedRow.id);
      if (result) {
         cache.clear();

         fetchAllPayment();
         fetchAllCustomer();
      } else {
         setOpenSnackBar({
            isOpen: true,
            message: 'Fail to delete data. System error',
         });
         setLoading(false);
      }
   }, [fetchAllPayment, selectedRow, fetchAllCustomer]);

   const startUpdatePayment = useCallback(
      async money => {
         setLoading(true);

         const result = await updatePayment(selectedRow.id, money);
         if (result) {
            cache.clear();

            fetchAllPayment();
            fetchAllCustomer();
         } else {
            setOpenSnackBar({
               isOpen: true,
               message: 'Fail to update data. System error',
            });
            setLoading(false);
         }
      },
      [fetchAllPayment, selectedRow, fetchAllCustomer]
   );

   const customerComboboxOnchange = value => {
      setSelectedCustomer(value);
      if (isInteger(money) && money > value.currentDebt) {
         alert("The money is bigger than customer's current debt");
      }
   };

   const handleInputChange = event => {
      const value = parseInt(event.target.value);
      if (!isNil(selectedCustomer) && value > selectedCustomer.currentDebt) {
         alert("The money is bigger than customer's current debt");
      } else {
         setMoney(value);
      }
   };

   const addNewPayment = () => {
      if (isNil(selectedCustomer) || !isInteger(money)) {
         alert('Wrong payment information');
      } else {
         startAddNewPayment();
      }
   };

   const closeDeleteDialog = isConfirm => {
      setOpenDeleteDialog(false);
      if (isConfirm) {
         startDeletePayment();
      }
   };

   const closeUpdateDialog = (newMoney, isCancel) => {
      setOpenUpdateDialog(false);
      if (newMoney !== selectedRow.money && !isCancel) {
         startUpdatePayment(newMoney);
      }
   };

   const handleCellClick = event => {
      setSelectedRow(event.row);
   };
   const closeSnackBar = () => {
      setOpenSnackBar({ isOpen: false });
   };

   useEffect(() => {
      fetchAllCustomer();
      fetchAllPayment();
   }, [fetchAllCustomer, fetchAllPayment]);

   return (
      <div className="data-grid">
         <div className="table">
            {loading && <Loading></Loading>}
            <div className="select-area">
               <Select
                  className="customer-select"
                  onChange={customerComboboxOnchange}
                  options={customerOption}
               ></Select>
               <input
                  onChange={handleInputChange}
                  type="number"
                  className="money-input"
                  value={money}
                  placeholder="Received money"
               ></input>
               <Button
                  onClick={addNewPayment}
                  variant="contained"
                  color="primary"
               >
                  add new payment
               </Button>
            </div>
            <h4 className="main-title">ALL PAYMENT</h4>
            <DataGrid
               onCellClick={handleCellClick}
               columns={columns}
               rows={rowData}
            ></DataGrid>
         </div>
         <SnackBar
            open={openSnackBar.isOpen}
            message={openSnackBar.message}
            onClose={closeSnackBar}
         ></SnackBar>
         <ConfirmDialog
            open={openDeleteDialog}
            close={closeDeleteDialog}
            message="Delete this payment?"
         ></ConfirmDialog>
         <UpdateDialog
            open={openUpdateDialog}
            close={closeUpdateDialog}
            currentDebt={currentDebt}
            payment={selectedRow}
         ></UpdateDialog>
      </div>
   );
}

export default memo(Payment);
