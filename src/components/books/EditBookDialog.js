import { useState, useEffect } from "react";
import { Dialog } from "@material-ui/core";
import Option from "./CategoryDialog";
export default function EditDiaLog(props) {
  const [editBook, setEditBook] = useState({});
  const [category, setCategory] = useState([]);

  useEffect(() => {
    setCategory(props.category);
  }, [props.category]);
  useEffect(() => {
    setEditBook(props.book);
  }, [props.book]);

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
      let value = editBook.amount + parseInt(event.target.value);
      if (value < 0) {
        value = 0;
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
        <div className="input-info">
          <p className="input-header"> Current amount: </p>
          <span>{editBook.amount}</span>
        </div>
        <div className="input-info">
          <p className="input-header"> Add amount</p>
          <input onBlur={changeAmount} className="input" type="number"></input>
        </div>

        <div className="error">Invalid input!!!</div>
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
