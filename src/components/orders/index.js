import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteBillApi, getAllBill } from "../../api/bill";
import Select from "react-select";
import { getAllCustomer } from "../../api/customer";
import { getAllBooks } from "../../api/book";
import { faPlusCircle, faTimesCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DataGrid } from "@material-ui/data-grid";

import DeleteDialog from "./DeleteDialog";

export default function Order() {
  const [customers, setCustomers] = useState([]);
  const [customerOption, setCustomerOption] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookOption, setBookOption] = useState([]);
  const [currentBookList, setCurrentBookList] = useState([]);
  const [selectedBook, setSelectedBook] = useState({ quantity: 1 });
  const [isDisableAddBook, setIsDisableAddBook] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [bills, setBill] = useState([]);

  const columns = [
    { field: "id", headerName: "Bill ID", width: 150 },
    { field: "name", headerName: "Customer Name", width: 250 },
    {
      field: "phone",
      headerName: "Phone",
      type: "number",
      width: 150,
    },
    {
      field: "date",
      headerName: "Create Date",
      type: "number",
      width: 270,
    },

    {
      field: "delete",
      headerName: "Delete",
      width: 130,
      renderCell: params => (
        <button onClick={deleteBill} className="data-grid-btn delete-btn">
          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
          <span>Delete</span>
        </button>
      ),
    },
  ];

  useEffect(() => {
    const res = getAllCustomer();
    setCustomers(res);
    fetchAllBook();
    fetchAllBill();
  }, []);
  useEffect(() => {
    assignCustomerLabel();
  }, [customers]);
  useEffect(() => {
    assignBookLabel();
  }, [books]);
  async function fetchAllBook() {
    const res = await getAllBooks();
    setBooks(res);
  }
  async function fetchAllBill() {
    const res = await getAllBill();
    console.log(res);
    const temp = [];
    for (const bill of res) {
      try {
        const info = {
          id: bill.billId,
          name: bill.customer.name,
          phone: bill.customer.phoneNumber,
          date: Date(bill.dateTime),
        };
        temp.push(info);
      } catch (error) {
        continue;
      }
    }
    setBill(temp);
  }
  const handleCellClick = event => {
    setSelectedRow(event.row);
  };
  const deleteBill = () => {
    setOpenDeleteDialog(true);
  };
  const customerComboboxOnchange = event => {
    setSelectedCustomer(event);
  };
  const bookComboboxOnchange = event => {
    setSelectedBook({ ...selectedBook, info: event });
  };
  const assignCustomerLabel = () => {
    const temp = [];
    for (const el of customers) {
      temp.push({ ...el, label: `${el.name}, Phone: ${el.phone}` });
    }
    setCustomerOption(temp);
  };

  const assignBookLabel = () => {
    const temp = [];
    for (const el of books) {
      temp.push({ ...el, label: el.title });
    }
    setBookOption(temp);
  };

  const priceChange = event => {
    setSelectedBook({ ...selectedBook, price: parseInt(event.target.value) });
    setIsDisableAddBook(false);
  };
  const addBookList = () => {
    setCurrentBookList([...currentBookList, selectedBook]);
  };
  const removeBook = bookName => {
    const newList = currentBookList.filter(el => el.info.title !== bookName);
    setCurrentBookList(newList);
  };

  const changeQuantity = event => {
    let quantity = parseInt(event.target.value);
    if (quantity < 0) {
      quantity = 1;
    }
    setSelectedBook({ ...selectedBook, quantity: quantity });
  };
  const closeDeleteDialog = isConfirm => {
    setOpenDeleteDialog(false);
    if (isConfirm) {
      deleteBillApi(selectedRow.id);
      setTimeout(fetchAllBill, 2000);
    }
  };
  const addNewBill = () => {};

  return (
    <div className="data-grid">
      <div className="add-area">
        <div>
          <h4 className="main-title">BILL INFO</h4>
          <div className="select-div">
            <p>Select customer</p>
            <Select className="select-option" onChange={customerComboboxOnchange} options={customerOption}></Select>
          </div>
          <div className="select-div">
            <p>Select book</p>
            <Select className="select-option" onChange={bookComboboxOnchange} options={bookOption}></Select>
          </div>
          <div className="select-div">
            <p>Quantity</p>
            <input defaultValue="1" onChange={changeQuantity} type="number"></input>
          </div>
          <div className="select-div">
            <input onBlur={priceChange} className="price-input" type="number"></input>

            <button disabled={isDisableAddBook} className="order-button" onClick={addBookList}>
              Add book
            </button>
          </div>
          <div className="add-bill-div">
            <button onClick={addNewBill}>
              <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
              <span>ADD NEW BILL</span>
            </button>
          </div>
        </div>
        <div className="book-list">
          <h4 className="main-title">CURRENT BOOKLIST</h4>
          {currentBookList.length < 1 ? (
            <div className="empty-list">
              <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
              <span>Empty</span>
            </div>
          ) : (
            <div className="current-book-list">
              <BookList removeBook={removeBook} books={currentBookList}></BookList>
            </div>
          )}
        </div>
      </div>
      <div className="order-table">
        <h4 className="main-title">ALL BILL</h4>
        <DataGrid onCellClick={handleCellClick} columns={columns} rows={bills}></DataGrid>
      </div>
      <DeleteDialog closeDeleteDialog={closeDeleteDialog} openDeleteDialog={openDeleteDialog}></DeleteDialog>
    </div>
  );
}

function BookList(props) {
  let i = 0;
  const content = props.books.map(el => (
    <div className="book-item" key={i++}>
      <p>
        <span>Title:</span> {el.info.title}
      </p>
      <p>
        <span>Price:</span> {el.price}
      </p>
      <p>
        <span>Quantity:</span> {el.quantity}
      </p>
      <button onClick={e => props.removeBook(el.info.title)} className="delele-book-button">
        Delete
      </button>
    </div>
  ));

  return content;
}
