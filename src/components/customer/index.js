import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState } from "react";
import { faPenAlt, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getAllCustomer } from "../../api/customer";
import EditCustomerDiaLog from "./EditCustomerDialog";
import AddCustomerDialog from "./AddCustomerDialog";
import DeleteDialog from "./DeleteCustomerDialog";
import SnackBar from "../SnackBar";

export default function Customer() {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [selectedRow, setSelectedRow] = useState({});
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    {
      field: "address",
      headerName: "Address",
      width: 150,
    },
    {
      field: "phone",
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
      field: "edit",
      headerName: "Edit",
      width: 110,
      renderCell: params => (
        <button className="data-grid-btn edit-btn" onClick={editButtonClick}>
          <FontAwesomeIcon icon={faPenAlt}></FontAwesomeIcon>
          <span>Edit</span>
        </button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 130,
      renderCell: params => (
        <button className="data-grid-btn delete-btn" onClick={deleteButtonClick}>
          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
          <span>Delete</span>
        </button>
      ),
    },
  ];
  function fetchAllCustomer() {
    setRows(getAllCustomer());
  }
  useEffect(() => {
    fetchAllCustomer();
  }, []);

  const [rows, setRows] = useState([]);
  const editButtonClick = el => {
    setOpenEditDialog(true);
  };
  const deleteButtonClick = el => {
    setOpenDeleteDialog(true);
  };
  const handleCellClick = el => {
    setSelectedRow(el.row);
  };

  const closeEditDialog = (editBook, isCancel) => {
    setOpenEditDialog(false);
  };

  const addBookClick = () => {
    setOpenAddDialog(true);
  };
  const closeAdddDialog = () => {
    setOpenAddDialog(false);
  };
  const closeDeleteDialog = isConfirm => {
    setOpenDeleteDialog(false);
  };

  return (
    <div className="data-grid">
      <div className="table">
        {/* <div ref={loadingRef} className="loading-row">
          <p>Loading...</p>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div> */}

        <div className="outside-button">
          <button onClick={addBookClick} className="add-button data-grid-btn">
            <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
            <span>Add new customer</span>
          </button>
        </div>
        <DataGrid onCellClick={handleCellClick} rows={rows} columns={columns} pageSize={5} />
      </div>
      <EditCustomerDiaLog
        openEditDialog={openEditDialog}
        customer={selectedRow}
        closeEditDialog={closeEditDialog}
      ></EditCustomerDiaLog>
      <AddCustomerDialog openAddDialog={openAddDialog} closeAddDialog={closeAdddDialog}></AddCustomerDialog>
      <DeleteDialog closeDeleteDialog={closeDeleteDialog} openDeleteDialog={openDeleteDialog}></DeleteDialog>
      <SnackBar openSnackBar={openSnackBar} message={snackBarMessage}></SnackBar>
    </div>
  );
}
