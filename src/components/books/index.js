import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataGrid } from "@material-ui/data-grid";

import { useEffect, useState, useRef } from "react";
import { faPenAlt, faPlusCircle, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { addNewBook, deleteBook, getAllBooks, getAllCategory, upDateBook } from "../../api/book";
import * as XLSX from "xlsx";
import EditDiaLog from "./EditBookDialog";
import AddNewBookDialog from "./AddBookDialog";
import DeleteDialog from "./DeleteDialog";
import SnackBar from "./SnackBar";

export default function Books() {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [selectedRow, setSelectedRow] = useState({});
  const [category, setCategory] = useState([]);
  const loadingRef = useRef();
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 350 },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: params => <span>{params.value.name}</span>,
    },
    {
      field: "author",
      headerName: "Author",
      width: 150,
    },
    {
      field: "amount",
      headerName: "Amount",
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

  async function fetchAllCategory() {
    const res = await getAllCategory();
    if (res !== null) {
      setCategory(res);
    }
  }

  async function fetchAllBook() {
    if (loadingRef.current !== null) loadingRef.current.style.display = "flex";
    const res = await getAllBooks();
    if (res !== null) {
      const rowData = [];
      for (const element of res) {
        rowData.push({
          id: element.id,
          name: element.title,
          category: element.type,
          author: element.author,
          amount: element.currentAmount,
        });
      }
      setRows(rowData);
      setOpenSnackBar(false);
      loadingRef.current !== null && (loadingRef.current.style.display = "none");
    } else {
      loadingRef.current.style.display = "none";
      setOpenSnackBar(true);
      setSnackBarMessage("Fail to get data");
    }
  }
  useEffect(() => {
    fetchAllBook();
    fetchAllCategory();
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

  const closeEditDialog = (book, newBook, isCancel) => {
    setOpenEditDialog(false);
    if (!isCancel) {
      const result = upDateBook(newBook);
      if (result) {
        setOpenSnackBar(true);
        setSnackBarMessage("Action completed loading data...");
        setTimeout(fetchAllBook, 2000);
      }
    }
  };

  const addBookClick = () => {
    setOpenAddDialog(true);
  };
  const closeAdddDialog = (newBook, isCancel) => {
    setOpenAddDialog(false);
    if (!isCancel) {
      const result = addNewBook(newBook);
      if (result) {
        setOpenSnackBar(true);
        setSnackBarMessage("Action completed loading data...");
        setTimeout(fetchAllBook, 2000);
      }
    }
  };
  const closeDeleteDialog = isConfirm => {
    setOpenDeleteDialog(false);
    if (isConfirm) {
      const result = deleteBook(selectedRow.id);
      if (result) {
        setOpenSnackBar(true);
        setSnackBarMessage("Action completed loading data...");
        setTimeout(fetchAllBook, 2000);
      }
    }
  };
  const hanldeFileSubmit = e => {
    e.preventDefault();
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = evt => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });

      console.log("Data>>>" + data); // shows that excel data is read
      console.log(convertToJson(data)); // shows data in json format
    };
    reader.readAsBinaryString(file);
  };
  const convertToJson = csv => {
    const lines = csv.split("\n");

    const result = [];

    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentline = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return JSON.stringify(result);
  };
  return (
    <div className="data-grid">
      <div className="table">
        <div ref={loadingRef} className="loading-row">
          <p>Loading...</p>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <div className="outside-button">
          <button onClick={addBookClick} className="add-button data-grid-btn">
            <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
            <span>Add new book</span>
          </button>
          <button className="import-button data-grid-btn">
            <input
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={hanldeFileSubmit}
              type="file"
              name="file"
              id="file"
              className="inputfile"
            />
            <label htmlFor="file">
              <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
              <span>Import from excel</span>
            </label>
          </button>
        </div>
        <DataGrid onCellClick={handleCellClick} rows={rows} columns={columns} pageSize={5} />
      </div>
      <EditDiaLog
        openEditDialog={openEditDialog}
        book={selectedRow}
        closeEditDialog={closeEditDialog}
        category={category}
      ></EditDiaLog>
      <AddNewBookDialog openAddDialog={openAddDialog} closeAddDialog={closeAdddDialog} category={category}></AddNewBookDialog>
      <DeleteDialog closeDeleteDialog={closeDeleteDialog} openDeleteDialog={openDeleteDialog}></DeleteDialog>
      <SnackBar openSnackBar={openSnackBar} message={snackBarMessage}></SnackBar>
    </div>
  );
}
