import { useEffect, useState } from "react";
import Switch from "@material-ui/core/Switch";
import getAllConfig from "../../api/settings";
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

  useEffect(() => {
    async function fetchData() {
      const res = await getAllConfig();
      console.log(res);
      setConfigs(res);
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
  };

  return (
    <div className="data-grid">
      {configs.length > 0 ? (
        <div>
          <div className="setting-title">
            <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
            <span>custom settings</span>
          </div>
          <div className="config-item">
            <h4>Minimum import book</h4>
            <p>Value: {configs[0].value}</p>
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
          <div className="config-item">
            <h4>Maximum amount book left before import</h4>
            <p>Value: {configs[1].value}</p>
            <div>
              <span>Enable:</span>
              <Switch
                onChange={hanldeToggleChange}
                checked={isCheck.MaximumAmountBookLeftBeforeImport}
                color="primary"
                name="MaximumAmountBookLeftBeforeImport"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </div>
          <div className="config-item">
            <h4>Maximum customer debt</h4>
            <p>Value: {configs[2].value}</p>
            <div>
              <span>Enable:</span>
              <Switch
                onChange={hanldeToggleChange}
                checked={isCheck.MaximumDebtCustomer}
                color="primary"
                name="MaximumDebtCustomer"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </div>
          <div className="config-item">
            <h4>Maximum amount book left after selling</h4>
            <p>Value: {configs[3].value}</p>
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
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
