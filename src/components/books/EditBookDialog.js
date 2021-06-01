import { useState, useEffect } from "react";
import { Dialog } from "@material-ui/core";
import Option from "./CategoryDialog";
import { getConfigItem } from "../../api/settings";
export default function EditDiaLog(props) {
  const [editBook, setEditBook] = useState({});
  const [category, setCategory] = useState([]);
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
    setEditBook(prevState => {
      return { ...prevState, name: event.target.value };
    });
  };
  const changeAuthor = event => {
    setEditBook(prevState => {
      return { ...prevState, author: event.target.value };
    });
  };
  const changeAmount = event => {
    if (handleNumberInput(event.target.value)) {
      const errorDiv = document.querySelector(".error");
      //Check mininum add amount
      let addAmount = parseInt(event.target.value);
      if (addAmount > 0 && addAmount < 150 && minimumImportBook.status) {
        errorDiv.style.display = "block";
        return;
      }

      //Check maximum amount
      let value = editBook.amount + parseInt(event.target.value);
      if (value < 0) {
        value = 1;
      } else if (value > parseInt(maximumBook.value) && maximumBook.status) {
        errorDiv.style.display = "block";
        return;
      }

      setEditBook(prevState => {
        return { ...prevState, amount: value };
      });
    }
  };
  const changeCategoryId = id => {
    setEditBook(prevState => {
      return { ...prevState, type: id };
    });
  };
  const handleNumberInput = value => {
    const errorDiv = document.querySelector(".error");
    const reg = new RegExp(/^-?[0-9]\d*(\.\d+)?$/);
    if (reg.test(value)) {
      errorDiv.style.display = "none";
      return true;
    } else {
      errorDiv.style.display = "block";
      return false;
    }
  };
  const closeDialog = () => {
    setEditBook(prevState => {
      return { ...prevState, amount: props.book.amount };
    });
    props.closeEditDialog(null, null, true);
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
          <Option changeCategoryId={changeCategoryId} currentCategory={props.book.category} category={category}></Option>
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
          <input onBlur={changeAmount} className="input" type="number"></input>
        </div>

        <div className="error">Invalid input, please check all condition</div>
        <div className="button-div">
          <button className="save-button" onClick={e => props.closeEditDialog(props.book, editBook, false)}>
            Save
          </button>
          <button className="cancle-button" onClick={closeDialog}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}
