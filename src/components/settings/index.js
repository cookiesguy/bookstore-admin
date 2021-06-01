import { useEffect, useRef, useState } from "react";
import Switch from "@material-ui/core/Switch";
import { getAllConfig, toogleConfig } from "../../api/settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

export default function Setting() {
  const [configs, setConfigs] = useState([]);
  const [isCheck, setIsCheck] = useState({
    MinimumImportBook: true,
    MaximumAmountBookLeftBeforeImport: true,
    MaximumDebtCustomer: true,
    MaximumAmountBookLeftAfterSelling: true,
  });

  const loadingRef = useRef();

  useEffect(() => {
    loadingRef.current.style.display = "flex";
    async function fetchData() {
      const res = await getAllConfig();
      setConfigs(res);
      loadingRef.current.style.display = "none";
    }
    fetchData();
  }, []);

  useEffect(() => {
    for (const el of configs) {
      setIsCheck({ ...isCheck, [el.name]: el.status });
    }
  }, [configs]);

  const hanldeToggleChange = event => {
    setIsCheck({ ...isCheck, [event.target.name]: event.target.checked });
    toogleConfig(event.target.name);
  };

  return (
    <div className="data-grid">
      <div ref={loadingRef} className="setting-loading">
        <p>Loading...</p>
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      {configs.length > 0 ? (
        <div>
          <div className="setting-title">
            <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
            <span>custom settings</span>
          </div>
          <div className="config-item">
            <h4>Maximum Debt Customer</h4>
            <p>Value: {configs[0].value}</p>
            <div>
              <span>Enable:</span>
              <Switch
                onChange={hanldeToggleChange}
                checked={isCheck.MaximumDebtCustomer}
                color="primary"
                name="MaximumAmountBookLeftBeforeImport"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </div>
          <div className="config-item">
            <h4>Maximum Amount Book Left Before Import</h4>
            <p>Value: {configs[1].value}</p>
            <div>
              <span>Enable:</span>
              <Switch
                onChange={hanldeToggleChange}
                checked={isCheck.MaximumAmountBookLeftBeforeImport}
                color="primary"
                name="MaximumDebtCustomer"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </div>
          <div className="config-item">
            <h4>Maximum Amount Book Left After Selling</h4>
            <p>Value: {configs[2].value}</p>
            <div>
              <span>Enable:</span>
              <Switch
                onChange={hanldeToggleChange}
                checked={isCheck.MaximumAmountBookLeftAfterSelling}
                color="primary"
                name="MaximumAmountBookLeftAfterSelling"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </div>
          <div className="config-item">
            <h4>Minimum Import Book</h4>
            <p>Value: {configs[3].value}</p>
            <div>
              <span>Enable:</span>
              <Switch
                onChange={hanldeToggleChange}
                checked={isCheck.MinimumImportBook}
                color="primary"
                name="MinimumImportBook"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
