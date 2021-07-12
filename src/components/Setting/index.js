import { useCallback, useEffect, useState, memo } from 'react';
import { Button, Switch } from '@material-ui/core';
import { isNull, isEqual, cloneDeep } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { getAllConfig, toggleConfig, changeConfigValue } from 'api/settings';
import SnackBar from 'components/Common/SnackBar';

function Setting() {
   const [configs, setConfigs] = useState([]);

   const [newConfigs, setNewConfigs] = useState([]);

   const [openSnackBar, setOpenSnackBar] = useState(false);

   const [successSnackBar, setSuccessSnackBar] = useState({
      isOpen: false,
      message: '',
   });

   const [isCheck, setIsCheck] = useState({
      MinimumImportBook: true,
      MaximumAmountBookLeftBeforeImport: true,
      MaximumDebtCustomer: true,
      MinimumAmountBookLeftAfterSelling: true,
   });

   const [loading, setLoading] = useState(true);

   const fetchData = useCallback(async () => {
      const res = await getAllConfig();
      if (isNull(res)) {
         setOpenSnackBar(true);
         setLoading(false);
      } else {
         setConfigs(res);
         setNewConfigs(res);
         setLoading(false);
      }
   }, []);

   const handleToggleChange = async event => {
      setLoading(true);
      setIsCheck({ ...isCheck, [event.target.name]: event.target.checked });
      await toggleConfig(event.target.name);
      setLoading(false);
   };

   const handleInputChange = (event, index) => {
      const temp = cloneDeep(newConfigs);
      console.log(temp[0] === newConfigs[0]);
      const value = parseInt(event.target.value);
      if (value >= 0) {
         temp[index].value = value;
      } else if (isNaN(value)) {
         temp[index].value = '';
      }
      setNewConfigs(temp);
   };

   const resetButtonClick = () => {
      setNewConfigs([...configs]);
   };

   const startChangeConfig = useCallback(async () => {
      setLoading(true);
      const result = await changeConfigValue(newConfigs);
      if (result) {
         setSuccessSnackBar({ isOpen: true, message: 'Save successfully' });
         changeConfigValue(newConfigs);

         fetchData();
      } else {
         setSuccessSnackBar({
            isOpen: false,
            message: 'An error occurred, cant save now',
         });
      }
   }, [newConfigs, fetchData]);

   const saveButtonClick = () => {
      if (isEqual(configs, newConfigs)) {
         alert('There are no difference to change');
      } else {
         startChangeConfig();
      }
   };

   const closeSnackBar = () => {
      setOpenSnackBar(false);
   };

   const closeSuccessSnackBar = () => {
      setSuccessSnackBar({ isOpen: false, message: '' });
   };

   useEffect(() => {
      setLoading(true);
      fetchData();
   }, [fetchData]);

   useEffect(() => {
      setNewConfigs([...configs]);
   }, [configs]);

   useEffect(() => {
      if (newConfigs.length) {
         let temp = {};
         newConfigs.map(element => {
            temp = { ...temp, [element.name]: element.status };
            return temp;
         });
         setIsCheck(temp);
      }
   }, [newConfigs]);

   return (
      <div className="data-grid">
         <div className="table">
            {loading && (
               <div className="setting-loading">
                  <p>Loading...</p>
                  <div className="lds-ellipsis">
                     <div></div>
                     <div></div>
                     <div></div>
                     <div></div>
                  </div>
               </div>
            )}

            {newConfigs.length > 0 ? (
               <div>
                  <div className="setting-title">
                     <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
                     <span>custom settings</span>
                  </div>
                  <div className="config-item">
                     <h4> Maximum Amount Book Left Before Import </h4>
                     <p>
                        Value:
                        <input
                           type="number"
                           className="config-input"
                           value={newConfigs[0].value}
                           onChange={e => handleInputChange(e, 0)}
                        />
                     </p>
                     <div>
                        <span>Enable:</span>
                        <Switch
                           onChange={handleToggleChange}
                           checked={isCheck.MaximumAmountBookLeftBeforeImport}
                           color="primary"
                           name="MaximumAmountBookLeftBeforeImport"
                           inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                     </div>
                  </div>
                  <div className="config-item">
                     <h4>Maximum Debt Customer</h4>
                     <p>
                        Value:
                        <input
                           className="config-input"
                           value={newConfigs[1].value}
                           onChange={e => handleInputChange(e, 1)}
                        />
                     </p>
                     <div>
                        <span>Enable:</span>
                        <Switch
                           onChange={handleToggleChange}
                           checked={isCheck.MaximumDebtCustomer}
                           color="primary"
                           name="MaximumDebtCustomer"
                           inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                     </div>
                  </div>
                  <div className="config-item">
                     <h4> Minimum Amount Book Left After Selling </h4>
                     <p>
                        Value:
                        <input
                           className="config-input"
                           value={newConfigs[2].value}
                           onChange={e => handleInputChange(e, 2)}
                        />
                     </p>
                     <div>
                        <span>Enable:</span>
                        <Switch
                           onChange={handleToggleChange}
                           checked={isCheck.MinimumAmountBookLeftAfterSelling}
                           color="primary"
                           name="MinimumAmountBookLeftAfterSelling"
                           inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                     </div>
                  </div>
                  <div className="config-item">
                     <h4>Minimum Import Book</h4>
                     <p>
                        Value:
                        <input
                           className="config-input"
                           value={newConfigs[3].value}
                           onChange={e => handleInputChange(e, 3)}
                        />
                     </p>
                     <div>
                        <span>Enable:</span>
                        <Switch
                           onChange={handleToggleChange}
                           checked={isCheck.MinimumImportBook}
                           color="primary"
                           name="MinimumImportBook"
                           inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                     </div>
                  </div>
                  <div className="config-item">
                     <div>
                        <Button
                           variant="contained"
                           color="primary"
                           onClick={saveButtonClick}
                        >
                           save value
                        </Button>
                        <Button
                           onClick={resetButtonClick}
                           variant="contained"
                           color="secondary"
                        >
                           reset
                        </Button>
                        <SnackBar
                           open={successSnackBar.isOpen}
                           message={successSnackBar.message}
                           onClose={closeSuccessSnackBar}
                        ></SnackBar>
                     </div>
                  </div>
               </div>
            ) : (
               <SnackBar
                  open={openSnackBar}
                  message="Cant get data, network error"
                  onClose={closeSnackBar}
               ></SnackBar>
            )}
         </div>
      </div>
   );
}

export default memo(Setting);
