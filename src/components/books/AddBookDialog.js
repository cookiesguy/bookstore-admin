import { useState, useEffect, useRef } from "react";
import { Dialog } from "@material-ui/core";
import Option from "./CategoryDialog";
export default function AddNewBookDialog(props) {
  const [newBook, setNewBook] = useState({ type: 1, amount: "", name: "", author: "" });
  const [category, setCategory] = useState([{ name: "" }]);
  const errorRef = useRef();

  useEffect(() => {
    setCategory(props.category);
  }, [props.category]);

  const handleNumberInput = event => {
    const reg = new RegExp("^[0-9]+$");
    if (reg.test(event.key)) {
      errorRef.current.style.display = "none";
    } else {
      errorRef.current.style.display = "block";
    }
  };

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
    if (
      !checkStringValid(newBook.name) ||
      !checkStringValid(newBook.author) ||
      newBook.amount.length < 1 ||
      isNaN(newBook.amount)
    ) {
      errorRef.current.style.display = "block";
    } else {
      errorRef.current.style.display = "none";
      setNewBook({ type: 1, amount: "", name: "", author: "" });
      props.closeAddDialog(newBook, false);
    }
  };
  const checkStringValid = str => {
    for (let i = 0; i < str.length; i++) {
      let ascii = str.charCodeAt(i);
      if (ascii > 47 && ascii < 58) {
        return true;
      } else if (ascii > 47 && ascii < 91) {
        return true;
      } else if (ascii > 96 && ascii < 123) {
        return true;
      }
    }
    return false;
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
          <input onBlur={changeAmount} onKeyPress={handleNumberInput} className="input" type="number"></input>
        </div>

        <div className="error" ref={errorRef}>
          Invalid input!!!
        </div>
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
