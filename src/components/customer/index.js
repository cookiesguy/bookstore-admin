import { useEffect, useState, useMemo, memo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataGrid } from "@material-ui/data-grid";
import cache from "memory-cache";
import { isNull } from "lodash";
import { faPenAlt, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { addNewCustomer, getAllCustomer, updateCustomer } from "api/customer";
import SnackBar from "components/Common/SnackBar";
import Loading from "components/Common/Loading";
import RenderCellExpand from "components/Common/RenderCellExpand";
import { time } from "Config/cache";
import EditCustomerDiaLog from "./EditCustomerDialog";
import AddCustomerDialog from "./AddCustomerDialog";

function Customer() {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [openSnackBar, setOpenSnackBar] = useState(false);

  const [snackBarMessage, setSnackBarMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [selectedRow, setSelectedRow] = useState({});

  const [rows, setRows] = useState([]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 90 },
      { field: "name", headerName: "Name", width: 150 },
      {
        field: "address",
        headerName: "Address",
        width: 150,
        renderCell: RenderCellExpand,
      },
      {
        field: "phoneNumber",
        headerName: "Phone",
        width: 150,
      },
      {
        field: "email",
        headerName: "Email",
        type: "number",
        width: 150,
      },
      {
        field: "currentDebt",
        headerName: "Current Debt",
        type: "number",
        width: 150,
      },
      {
        field: "edit",
        headerName: "Edit",
        width: 110,
        renderCell: (params) => (
          <button className="data-grid-btn edit-btn" onClick={editButtonClick}>
            <FontAwesomeIcon icon={faPenAlt} />
            <span>Edit</span>
          </button>
        ),
      },
    ],
    []
  );

  const fetchAllCustomer = useCallback(async () => {
    let data;
    const cacheMemo = cache.get("api/customer");
    if (cacheMemo) {
      data = cacheMemo;
    } else {
      data = await getAllCustomer();
    }

    if (isNull(data)) {
      setSnackBarMessage("Fail to get data");
      setOpenSnackBar(true);
      setLoading(false);
    } else {
      cache.put("api/customer", data, time);
      setRows(data);
      setLoading(false);
      setOpenSnackBar(false);
    }
  }, []);

  const editButtonClick = () => {
    setOpenEditDialog(true);
  };

  const handleCellClick = (event) => {
    setSelectedRow(event.row);
  };

  const closeEditDialog = async (customer, isCancel) => {
    setOpenEditDialog(false);
    if (!isCancel) {
      const res = await updateCustomer(customer);
      if (res) {
        setLoading(true);
        setSnackBarMessage("Action complete loading data...");
        setOpenSnackBar(true);
        cache.clear();
        fetchAllCustomer();
      } else {
        setSnackBarMessage("An occur error happen, please try later");
        setOpenSnackBar(true);
      }
    }
  };

  const addBookClick = () => {
    setOpenAddDialog(true);
  };

  const closeAdddDialog = async (newCustomer, isCancel) => {
    setOpenAddDialog(false);
    if (!isCancel) {
      const res = await addNewCustomer(newCustomer);
      if (res) {
        setLoading(true);
        setSnackBarMessage("Action complete loading data...");
        setOpenSnackBar(true);
        cache.clear();
        fetchAllCustomer();
      } else {
        setSnackBarMessage("An occur error happen, please try later");
        setOpenSnackBar(true);
      }
    }
  };

  const closeSnackBar = () => {
    setOpenSnackBar(false);
  };

  useEffect(() => {
    fetchAllCustomer();
  }, [fetchAllCustomer]);

  return (
    <div className="data-grid">
      <div className="table">
        {loading && <Loading />}
        <div className="outside-button">
          <button onClick={addBookClick} className="add-button data-grid-btn">
            <FontAwesomeIcon icon={faPlusCircle} />
            <span>Add new customer</span>
          </button>
        </div>
        <DataGrid
          onCellClick={handleCellClick}
          rows={rows}
          columns={columns}
          pageSize={5}
        />
      </div>
      <EditCustomerDiaLog
        openEditDialog={openEditDialog}
        customer={selectedRow}
        closeEditDialog={closeEditDialog}
      />
      <AddCustomerDialog
        openAddDialog={openAddDialog}
        closeAddDialog={closeAdddDialog}
      />

      <SnackBar
        open={openSnackBar}
        message={snackBarMessage}
        onClose={closeSnackBar}
      />
    </div>
  );
}

export default memo(Customer);
