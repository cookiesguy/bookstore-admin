import { useState, useCallback, useEffect, memo } from 'react';
import { isNull } from 'lodash';
import Select from 'react-select';

import SnackBar from 'components/Common/SnackBar';
import { getAllCustomer } from 'api/customer';

function Payment() {
   const [customerOption, setCustomerOption] = useState([]);

   const [openSnackBar, setOpenSnackBar] = useState({
      isOpen: false,
      message: '',
   });

   const [selectedCustomer, setSelectedCustomer] = useState({});

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
      const data = await getAllCustomer();
      if (isNull(data)) {
         setOpenSnackBar({ isOpen: true, message: 'Fail to get data' });
         return;
      }
      assignCustomerLabel(data);
   }, [assignCustomerLabel]);

   const customerComboboxOnchange = value => {
      setSelectedCustomer(value);
   };

   useEffect(() => {
      fetchAllCustomer();
   }, [fetchAllCustomer]);

   return (
      <div className="data-grid">
         <div className="table">
            <Select
               className="select-option"
               onChange={customerComboboxOnchange}
               options={customerOption}
            ></Select>
            <input type="number" placeholder="Received money"></input>
         </div>
         <SnackBar
            openSnackBar={openSnackBar.isOpen}
            message={openSnackBar.message}
         ></SnackBar>
      </div>
   );
}

export default memo(Payment);
