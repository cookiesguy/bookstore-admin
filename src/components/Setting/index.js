/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Switch from '@material-ui/core/Switch';
import { isNull } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { getAllConfig, toggleConfig } from 'api/settings';
import SnackBar from 'components/Common/SnackBar';

export default function Setting() {
   const [configs, setConfigs] = useState([]);

   const [openSnackBar, setOpenSnackBar] = useState(false);

   const [isCheck, setIsCheck] = useState({
      MinimumImportBook: true,
      MaximumAmountBookLeftBeforeImport: true,
      MaximumDebtCustomer: true,
      MaximumAmountBookLeftAfterSelling: true,
   });

   const [loading, setLoading] = useState(true);

   const handleToggleChange = event => {
      setIsCheck({ ...isCheck, [event.target.name]: event.target.checked });
      toggleConfig(event.target.name);
   };

   useEffect(() => {
      setLoading(true);
      async function fetchData() {
         const res = await getAllConfig();
         if (isNull(res)) {
            setOpenSnackBar(true);
            setLoading(false);
         } else {
            setConfigs(res);
            setLoading(false);
         }
      }
      fetchData();
   }, []);

   useEffect(() => {
      for (const el of configs) {
         setIsCheck({ ...isCheck, [el.name]: el.status });
      }
   }, [configs]);

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

            {configs.length > 0 ? (
               <div>
                  <div className="setting-title">
                     <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
                     <span>custom settings</span>
                  </div>
                  <div className="config-item">
                     <h4>Maximum Amount Book Left After Selling</h4>
                     <p>Value: {configs[0].value}</p>
                     <div>
                        <span>Enable:</span>
                        <Switch
                           onChange={handleToggleChange}
                           checked={isCheck.MaximumAmountBookLeftAfterSelling}
                           color="primary"
                           name="MaximumAmountBookLeftAfterSelling"
                           inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                     </div>
                  </div>
                  <div className="config-item">
                     <h4>Maximum Amount Book Left Before Import</h4>
                     <p>Value: {configs[1].value}</p>
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
                     <p>Value: {configs[2].value}</p>
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
                     <h4>Minimum Import Book</h4>
                     <p>Value: {configs[3].value}</p>
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
