import { useEffect, useState, memo, useMemo, useCallback } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Select from "react-select";
import cache from "memory-cache";
import { isNull, find, isUndefined, isInteger } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { getAllCustomer } from "api/customer";
import { getAllBooks } from "api/book";
import { deleteBillApi, getAllBill, createBill, updateBillApi } from "api/bill";
import { getConfigItem } from "api/settings";
import SnackBar from "components/Common/SnackBar";
import ConfirmDialog from "components/Common/ConfirmDialog";
import Loading from "components/Common/Loading";
import RenderCellExpand from "components/Common/RenderCellExpand";
import { time } from "Config/cache";
import UpdateDialog from "./UpdateDialog";
import BookList from "./BookList";

function Order() {
  const [customerOption, setCustomerOption] = useState([]);

  const [bookOption, setBookOption] = useState([]);

  const [currentBookList, setCurrentBookList] = useState([]);

  const [selectedBook, setSelectedBook] = useState({ amount: 1 });

  const [loading, setLoading] = useState(true);

  const [isDisableAddBook, setIsDisableAddBook] = useState(true);

  const [selectedCustomer, setSelectedCustomer] = useState();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [currentDebt, setCurrentDebt] = useState({});

  const [updateDebt, setUpdateDebt] = useState(0);

  const [minBookLeft, setMinBookLeft] = useState({});

  const [maximumDebt, setMaximumDebt] = useState({});

  const [invalidAmount, setInvalidAmount] = useState(false);

  const [openSnackBar, setOpenSnackBar] = useState({
    isOpen: false,
    message: "",
  });

  const [selectedRow, setSelectedRow] = useState({});

  const [bills, setBill] = useState([]);

  const [totalMoney, setTotalMoney] = useState(0);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "Bill ID", width: 150 },
      { field: "customerId", headerName: "Customer ID", width: 150 },
      { field: "name", headerName: "Customer Name", width: 200 },
      {
        field: "phone",
        headerName: "Phone",
        width: 150,
      },
      {
        field: "date",
        headerName: "Create Date",
        width: 150,
        renderCell: RenderCellExpand,
      },

      {
        field: "delete",
        headerName: "Delete",
        width: 130,
        renderCell: (params) => (
          <button onClick={deleteBill} className="data-grid-btn delete-btn">
            <FontAwesomeIcon icon={faTrash} />
            <span>Delete</span>
          </button>
        ),
      },
      {
        field: "update",
        headerName: "Update",
        width: 130,
        renderCell: (params) => (
          <button onClick={updateBill} className="data-grid-btn edit-btn">
            <FontAwesomeIcon icon={faHistory} />
            <span>Update</span>
          </button>
        ),
      },
    ],
    []
  );

  const assignCustomerLabel = useCallback((customers) => {
    const temp = [];
    for (const el of customers) {
      temp.push({
        label: `${el.name}, Phone: ${el.phoneNumber}, CurrentDebt: ${el.currentDebt}`,
        id: el.id,
        currentDebt: el.currentDebt,
      });
    }
    setCustomerOption(temp);
  }, []);

  const assignBookLabel = useCallback((books) => {
    const temp = [];
    for (const el of books) {
      temp.push({
        label: `${el.title}. Amount: ${el.currentAmount}`,
        id: el.id,
        currentAmount: el.currentAmount,
      });
    }
    setBookOption(temp);
  }, []);

  const fetchAllBook = useCallback(async () => {
    const cacheData = cache.get("api/books/order");
    let data = await getAllBooks();
    if (cacheData) {
      data = cacheData;
    } else {
      data = await getAllBooks();
      cache.put("api/books/order", data, time);
    }
    if (isNull(data)) {
      setOpenSnackBar(true);
      return;
    }
    assignBookLabel(data);
  }, [assignBookLabel]);

  const fetchAllCustomer = useCallback(async () => {
    let data;
    const cacheData = cache.get("api/customer/order");
    if (cacheData) {
      data = cacheData;
    } else {
      data = await getAllCustomer();
      cache.put("api/customer/order", data, time);
    }
    if (isNull(data)) {
      setOpenSnackBar(true);
      return;
    }
    assignCustomerLabel(data);
  }, [assignCustomerLabel]);

  const refactorBill = useCallback((data) => {
    const temp = [];
    for (const bill of data) {
      try {
        temp.push({
          id: bill.id,
          customerId: bill.customer.id,
          name: bill.customer.name,
          phone: bill.customer.phoneNumber,
          date: Date(bill.dateTime),
          details: bill.details,
        });
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    return temp;
  }, []);

  const fetchAllBill = useCallback(async () => {
    const data = await getAllBill();
    if (isNull(data)) {
      setOpenSnackBar({
        isOpen: true,
        message: "Fail to get data",
      });
      return;
    }
    const rowData = refactorBill(data);
    setLoading(false);
    setBill(rowData);
  }, [refactorBill]);

  const getConfig = useCallback(async () => {
    const min = await getConfigItem("MinimumAmountBookLeftAfterSelling");
    const max = await getConfigItem("MaximumDebtCustomer");
    setMinBookLeft(min);
    setMaximumDebt(max);
  }, []);

  const handleCellClick = (event) => {
    setSelectedRow(event.row);
    const foundCustomer = find(customerOption, { id: event.row.customerId });
    if (!isUndefined(foundCustomer)) setUpdateDebt(foundCustomer.currentDebt);
  };

  const deleteBill = () => {
    setOpenDeleteDialog(true);
  };

  const customerComboboxOnchange = (value) => {
    setSelectedCustomer(value);
  };

  const bookComboboxOnchange = (event) => {
    setSelectedBook({ ...selectedBook, ...event });
  };

  const priceChange = (event) => {
    const value = parseInt(event.target.value);
    setSelectedBook({
      ...selectedBook,
      price: parseInt(value),
    });

    if (isInteger(value) && value > 0) setIsDisableAddBook(false);
    else setIsDisableAddBook(true);
  };

  const checkCanAddMore = useCallback(
    (bookList) => {
      if (bookList.length) {
        let sum = 0;
        for (const el of bookList) {
          sum += el.price * el.amount;
        }
        if (maximumDebt.status && sum + currentDebt > maximumDebt.value) {
          setIsDisableAddBook(true);
          alert("The total price is bigger than customer debt");
          return false;
        }
        setIsDisableAddBook(false);
        setTotalMoney(sum);
        return true;
      }
    },
    [currentDebt, maximumDebt]
  );

  const addBookList = useCallback(() => {
    if (!invalidAmount) {
      const foundBook = find(currentBookList, { id: selectedBook.id });
      if (foundBook) {
        foundBook.amount++;
        foundBook.price = selectedBook.price;
        const newList = currentBookList.filter((el) => el.id !== foundBook.id);
        newList.push(foundBook);
        if (checkCanAddMore(newList)) {
          setCurrentBookList(newList);
        }
        return;
      }
      if (checkCanAddMore([...currentBookList, selectedBook])) {
        setCurrentBookList([...currentBookList, selectedBook]);
      }
    }
  }, [currentBookList, selectedBook, invalidAmount, checkCanAddMore]);

  const removeBook = useCallback(
    (bookName) => {
      const newList = currentBookList.filter((el) => el.label !== bookName);
      setCurrentBookList(newList);
    },
    [currentBookList]
  );

  const changeQuantity = useCallback(
    (event) => {
      let amount = parseInt(event.target.value);

      if (!isInteger(amount) || amount < 0) {
        setInvalidAmount(true);
        return;
      }
      if (amount < 0) {
        amount = 1;
      } else if (
        minBookLeft.status &&
        (selectedBook.currentAmount - amount < minBookLeft.value ||
          isNaN(amount))
      ) {
        setInvalidAmount(true);
        return;
      }
      setInvalidAmount(false);
      setSelectedBook({ ...selectedBook, amount: amount });
    },
    [minBookLeft, selectedBook]
  );

  const startUpdateBill = useCallback(
    async (bookList) => {
      setLoading(true);
      const result = await updateBillApi(selectedRow.id, bookList);
      if (result) {
        cache.clear();
        setOpenSnackBar({
          isOpen: true,
          message: "Action complete loading data...",
        });

        fetchAllBill();
        fetchAllCustomer();
      } else {
        setLoading(false);
        setOpenSnackBar({
          isOpen: true,
          message: "Fail to update data",
        });
      }
    },
    [selectedRow, fetchAllBill, fetchAllCustomer]
  );

  const closeDeleteDialog = async (isConfirm) => {
    setOpenDeleteDialog(false);
    if (isConfirm) {
      setLoading(true);
      setOpenSnackBar({
        isOpen: true,
        message: "Action complete loading data...",
      });
      cache.clear();
      await deleteBillApi(selectedRow.id);

      fetchAllBill();
      fetchAllCustomer();
    }
  };

  const closeUpdateDialog = (bookList, isCancel) => {
    setOpenUpdateDialog(false);
    if (isCancel) return;
    startUpdateBill(bookList);
  };

  const addNewBill = async () => {
    if (isUndefined(selectedCustomer) && currentBookList.length) {
      setOpenSnackBar({
        isOpen: true,
        message: "Missing information in bill !!! ",
      });
      return;
    }
    setLoading(true);
    const result = await createBill(selectedCustomer, currentBookList);
    if (result) {
      cache.clear();

      setOpenSnackBar({
        isOpen: true,
        message: "Action complete loading data...",
      });

      fetchAllBill();
      fetchAllCustomer();
    }
  };

  const updateBill = () => {
    setOpenUpdateDialog(true);
  };

  const closeSnackBar = () => {
    setOpenSnackBar({
      isOpen: false,
      message: "",
    });
  };

  useEffect(() => {
    fetchAllCustomer();
    fetchAllBook();
    fetchAllBill();
    getConfig();
  }, [fetchAllBill, fetchAllBook, fetchAllCustomer, getConfig]);

  useEffect(() => {
    if (!isUndefined(selectedCustomer)) {
      const customer = find(customerOption, { id: selectedCustomer.id });
      setCurrentDebt(customer.currentDebt);
    }
  }, [selectedCustomer, customerOption]);

  return (
    <div className="data-grid">
      <div className="add-area">
        <div>
          <h4 className="main-title">BILL INFO</h4>
          <div className="select-div">
            <p>Select customer</p>
            <Select
              className="select-option"
              onChange={customerComboboxOnchange}
              options={customerOption}
            />
          </div>
          <div className="select-div">
            <p>Select book</p>
            <Select
              className="select-option"
              onChange={bookComboboxOnchange}
              options={bookOption}
            />
          </div>
          <div className="select-div">
            <p>Amount</p>

            {minBookLeft.status && (
              <p>Minimum book amount left: {minBookLeft.value}</p>
            )}

            <input defaultValue="1" onChange={changeQuantity} type="number" />

            {invalidAmount && <p className="error">Invalid book amount </p>}
          </div>
          <div className="select-div">
            {maximumDebt.status && (
              <p>Maximum customer debt: {maximumDebt.value}</p>
            )}
            <p>Price</p>
            <input
              onChange={priceChange}
              className="price-input"
              type="number"
            />

            <button
              disabled={isDisableAddBook}
              className="order-button"
              onClick={addBookList}
            >
              Add book
            </button>
          </div>
          <div className="add-bill-div">
            <button disabled={isDisableAddBook} onClick={addNewBill}>
              <FontAwesomeIcon icon={faPlusCircle} />
              <span>ADD NEW BILL</span>
            </button>
          </div>
        </div>
        <div className="book-list">
          <h4 className="main-title">CURRENT BOOKS IN BILL</h4>
          {currentBookList.length < 1 ? (
            <div className="empty-list">
              <span>Empty</span>
            </div>
          ) : (
            <div className="current-book-list">
              <BookList removeBook={removeBook} books={currentBookList} />
            </div>
          )}
          <p>Total money: {totalMoney}</p>
        </div>
      </div>
      <div className="order-table">
        <h4 className="main-title">ALL BILL</h4>
        <div className="order-data">
          {loading && <Loading />}
          <DataGrid
            onCellClick={handleCellClick}
            columns={columns}
            rows={bills}
          />
        </div>
      </div>
      <ConfirmDialog
        close={closeDeleteDialog}
        open={openDeleteDialog}
        message="Delete this bill?"
      />
      <SnackBar
        open={openSnackBar.isOpen}
        message={openSnackBar.message}
        onClose={closeSnackBar}
      />
      <UpdateDialog
        books={bookOption}
        billId={selectedRow.id}
        maximumDebt={maximumDebt}
        minBookLeft={minBookLeft}
        currentDebt={updateDebt}
        closeUpdateDialog={closeUpdateDialog}
        openUpdateDialog={openUpdateDialog}
      />
    </div>
  );
}

export default memo(Order);
