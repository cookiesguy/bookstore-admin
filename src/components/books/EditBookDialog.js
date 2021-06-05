import { useState, useEffect } from "react";
import { Dialog } from "@material-ui/core";
import Option from "./CategoryDialog";
import { getConfigItem } from "../../api/settings";
import { removeAscent } from "../../helper/vietnameseValidate";

export default function EditDiaLog(props) {
  const [editBook, setEditBook] = useState({
    category: {
      name: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState({ isDisplay: false, message: "" });
  const [category, setCategory] = useState([]);
  const [tempAmount, setTempAmount] = useState(0);
  const [minimumImportBook, setMinimumImportBook] = useState({});
  const [maximumBook, setMaximumBook] = useState({});

  useEffect(() => {
    setCategory(props.category);
  }, [props.category]);
  useEffect(() => {
    setEditBook(props.book);
    fetchConfig();
  }, [props.book]);

  const fetchConfig = async () => {
    const resOne = await getConfigItem("MinimumImportBook");
    const resTwo = await getConfigItem("MaximumAmountBookLeftBeforeImport");
    setMinimumImportBook(resOne);
    setMaximumBook(resTwo);
  };

  const changeName = event => {
    if (event.target.value === "")
      setEditBook(prevState => {
        return { ...prevState, name: props.book.name };
      });
    else
      setEditBook(prevState => {
        return { ...prevState, name: event.target.value };
      });
  };
  const changeAuthor = event => {
    if (event.target.value === "") {
      setEditBook(prevState => {
        return { ...prevState, author: props.book.author };
      });
    }
    setEditBook(prevState => {
      return { ...prevState, author: event.target.value };
    });
  };
  const changeAmount = () => {
    if (tempAmount < minimumImportBook.value && tempAmount > 0 && minimumImportBook.status) {
      setErrorMessage({ isDisplay: true, message: "Invalid minimum import" });
      return;
    }
    let value = tempAmount + editBook.amount;
    if (value > maximumBook.value && maximumBook.status) {
      setErrorMessage({ isDisplay: true, message: "Invalid maximum amount" });
      return;
    }
    setErrorMessage({ isDisplay: false, message: "" });
    if (value < 0) {
      setEditBook(prevState => {
        return { ...prevState, amount: 1 };
      });
    } else {
      setEditBook(prevState => {
        return { ...prevState, amount: value };
      });
    }
  };
  const changeCategoryId = object => {
    setEditBook(prevState => {
      return { ...prevState, category: object };
    });
  };
  const handleNumberInput = event => {
    const reg = new RegExp(/^-?[0-9]\d*(\.\d+)?$/);
    if (reg.test(event.target.value)) {
      setErrorMessage({ isDisplay: false, message: "" });
      setTempAmount(parseInt(event.target.value));
      return true;
    } else {
      setErrorMessage({ isDisplay: true, message: "Must be a number" });
      return false;
    }
  };
  const checkBookInfoValid = () => {
    if (!checkStringValid(editBook.name) || !checkStringValid(editBook.author)) {
      setErrorMessage({ isDisplay: true, message: "Invalid book info" });
      return false;
    } else {
      setErrorMessage({ isDisplay: false, message: "" });
      return true;
    }
  };
  const checkStringValid = str => {
    console.log("valid info");
    const regex = /[^A-Za-z0-9]+/;
    if (regex.test(removeAscent(str)) || str === "") {
      return false;
    }
    return true;
  };

  const closeDialog = isCancel => {
    if (isCancel) {
      setEditBook(prevState => {
        return { ...prevState, amount: props.book.amount };
      });
      setErrorMessage({ isDisplay: false, message: "" });
      props.closeEditDialog(null, true);
    } else {
      if (checkBookInfoValid()) {
        props.closeEditDialog(editBook, false);
      }
    }
  };
  return (
    <Dialog open={props.openEditDialog}>
      <div className="dialog">
        <h3>Edit book</h3>
        <div className="input-info">
          <p className="input-header">Name</p>
          <input onBlur={changeName} className="input" placeholder={props.book.name}></input>
        </div>
        <div className="input-info">
          <p className="input-header">Author</p>
          <input onBlur={changeAuthor} className="input" placeholder={props.book.author}></input>
        </div>
        <div className="input-info">
          <p className="input-header">Category</p>
          {props.book.category === undefined ? (
            <p></p>
          ) : (
            <Option changeCategoryId={changeCategoryId} currentCategory={props.book.category.name} category={category}></Option>
          )}
        </div>
        {maximumBook.status ? (
          <div className="input-info">
            <p className="input-header"> Maximum amount: </p>
            <span>{maximumBook.value}</span>
          </div>
        ) : (
          <div></div>
        )}
        {minimumImportBook.status ? (
          <div className="input-info">
            <p className="input-header"> Minimum add amount: </p>
            <span>{minimumImportBook.value}</span>
          </div>
        ) : (
          <div></div>
        )}

        <div className="input-info">
          <p className="input-header"> Current amount: </p>
          <span>{editBook.amount}</span>
        </div>

        <div className="input-info">
          <p className="input-header"> Add amount</p>
          <div className="plus-block">
            <input onBlur={handleNumberInput} type="number"></input>
            <button onClick={changeAmount}>Add</button>
          </div>
        </div>

        {errorMessage.isDisplay && <div className="error">{errorMessage.message}</div>}
        <div className="button-div">
          <button className="save-button" onClick={e => closeDialog(false)}>
            Save
          </button>
          <button className="cancle-button" onClick={e => closeDialog(true)}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}
