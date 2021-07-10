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

   const [openDifferenceAnnounce, setOpenDifferenceAnnounce] = useState(false);

   const [isCheck, setIsCheck] = useState({
      MinimumImportBook: true,
      MaximumAmountBookLeftBeforeImport: true,
      MaximumDebtCustomer: true,
      MinimumAmountBookLeftAfterSelling: true,
   });

   const [loading, setLoading] = useState(true);

   const handleToggleChange = event => {
      setIsCheck({ ...isCheck, [event.target.name]: event.target.checked });
      toggleConfig(event.target.name);
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

   const saveButtonClick = () => {
      if (isEqual(configs, newConfigs)) {
         setOpenDifferenceAnnounce(true);
         setTimeout(() => {
            setOpenDifferenceAnnounce(false);
         }, 3000);
      } else {
         changeConfigValue(newConfigs);
         setLoading(true);
         setTimeout(fetchData, 2000);
      }
   };

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
                           name="MinimumAmountBookLeftAfterSelling"
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
                           name="MaximumAmountBookLeftBeforeImport"
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
                     <div className="button-div">
                        <Button
                           variant="contained"
                           color="primary"
                           onClick={saveButtonClick}
                        >
                           save
                        </Button>
                        <Button
                           onClick={resetButtonClick}
                           variant="contained"
                           color="secondary"
                        >
                           reset
                        </Button>
                     </div>
                  </div>
                  <SnackBar
                     openSnackBar={openDifferenceAnnounce}
                     message="There are no difference to change"
                     isEnableClose={false}
                  ></SnackBar>
               </div>
            ) : (
               <SnackBar
                  openSnackBar={openSnackBar}
                  message="Cant get data, network error"
               ></SnackBar>
            )}
         </div>
      </div>
   );
}

export default memo(Setting);
