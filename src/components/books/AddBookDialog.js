import { useState, useEffect } from "react";
import { Dialog } from "@material-ui/core";
import Option from "./CategoryDialog";
import { removeAscent } from "../../helper/vietnameseValidate";

export default function AddNewBookDialog(props) {
  const [newBook, setNewBook] = useState({
    category: {
      id: 1,
    },
    amount: "",
    name: "",
    author: "",
  });
  const [category, setCategory] = useState([{ name: "" }]);
  const [errorMessage, setErrorMessage] = useState({ isDisplay: false, message: "" });

  useEffect(() => {
    setCategory(props.category);
  }, [props.category]);

  const changeName = event => {
    setNewBook(prevState => {
      return { ...prevState, name: event.target.value };
    });
  };

  const changeAuthor = event => {
    setNewBook(prevState => {
      return { ...prevState, author: event.target.value };
    });
  };

  const changeAmount = event => {
    setNewBook(prevState => {
      return { ...prevState, amount: event.target.value };
    });
  };
  const changeCategoryId = object => {
    setNewBook(prevState => {
      return { ...prevState, category: object };
    });
  };
  const checkBookInfoValid = () => {
    if (!checkStringValid(newBook.name) || !checkStringValid(newBook.author) || !checkValidAmount()) {
    } else {
      setErrorMessage({ isDisplay: false, message: "" });
      props.closeAddDialog(newBook, false);
    }
  };

  const checkStringValid = str => {
    console.log("valid info");
    const regex = /[^A-Za-z0-9]+/;
    if (regex.test(removeAscent(str)) || str === "") {
      setErrorMessage({ isDisplay: true, message: "Invalid book infomation" });
      return false;
    }
    setErrorMessage({ isDisplay: false, message: "" });
    return true;
  };

  const checkValidAmount = () => {
    console.log("valid number");
    const regex = new RegExp("^[0-9]*$");
    if (regex.test(newBook.amount) || newBook.amount !== "") {
      setErrorMessage({ isDisplay: false, message: "" });
      return true;
    } else {
      setErrorMessage({ isDisplay: true, message: "Invalid number please check all condition" });
      return false;
    }
  };

  return category.length > 0 ? (
    <Dialog open={props.openAddDialog}>
      <div className="dialog">
        <h3>Add book</h3>
        <div className="input-info">
          <p className="input-header">Name</p>
          <input onBlur={changeName} className="input"></input>
        </div>

        <div className="input-info">
          <p className="input-header">Author</p>
          <input onBlur={changeAuthor} className="input"></input>
        </div>
        <div className="input-info">
          <p className="input-header">Category</p>
          <Option changeCategoryId={changeCategoryId} currentCategory={category[0].name} category={category}></Option>
        </div>
        <div className="input-info">
          <p className="input-header">Amount</p>
          <input onBlur={changeAmount} className="input" type="number"></input>
        </div>
        {errorMessage.isDisplay && <div className="error">{errorMessage.message}</div>}

        <div className="button-div">
          <button onClick={checkBookInfoValid} className="save-button">
            Add
          </button>
          <button onClick={e => props.closeAddDialog(newBook, true)} className="cancle-button">
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  ) : (
    <div></div>
  );
}
