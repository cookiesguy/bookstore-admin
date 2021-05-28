import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataGrid } from "@material-ui/data-grid";
import { useEffect, useState, useRef } from "react";
import { faPenAlt, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getAllBooks } from "../../api";
import EditDiaLog from "./editbook";
import AddNewBookDialog from "./addbook";
export default function Books() {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const loadingRef = useRef();
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 350 },
    { field: "category", headerName: "Category", width: 150 },
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
        <button className="data-grid-btn delete-btn" onClick={editButtonClick}>
          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
          <span>Delete</span>
        </button>
      ),
    },
  ];

  useEffect(() => {
    async function fetchData() {
      const res = await getAllBooks();
      const rowData = [];
      for (const element of res) {
        rowData.push({
          id: element.id,
          name: element.title,
          category: element.type.name,
          author: element.author,
          amount: element.currentAmount,
        });
      }
      setRows(rowData);
      loadingRef.current.style.display = "none";
    }
    fetchData();
  }, []);
  const [rows, setRows] = useState([]);
  const editButtonClick = el => {
    setOpenEditDialog(true);
  };
  const handleCellClick = el => {
    setSelectedRow(el.row);
  };
  const editBookRequest = () => {};
  const closeEditDialog = (book, newBook, isCancle) => {
    setOpenEditDialog(false);
    if (!isCancle) {
      if (JSON.stringify(book) === JSON.stringify(newBook)) {
      } else {
        const index = rows.findIndex(x => x.id === book.id);
        console.log(rows, newBook);
        const temp = [...rows];
        temp[index] = newBook;
        setRows(temp);
      }
    }
  };
  const addBookClick = () => {
    setOpenAddDialog(true);
  };
  const closeAdddDialog = () => {
    setOpenAddDialog(false);
  };
  return (
    <div className="data-grid">
      <div className="table">
        <div ref={loadingRef} className="loading-row">
          <p>Loading data...</p>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <EditDiaLog openEditDialog={openEditDialog} book={selectedRow} closeEditDialog={closeEditDialog}></EditDiaLog>
        <AddNewBookDialog openAddDialog={openAddDialog} closeAddDialog={closeAdddDialog}></AddNewBookDialog>
        <div className="outside-button">
          <button onClick={addBookClick} className="add-button data-grid-btn">
            <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
            <span>Add new book</span>
          </button>
        </div>

        <DataGrid onCellClick={handleCellClick} rows={rows} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}
