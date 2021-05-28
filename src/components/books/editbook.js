import { useState, useEffect } from "react";
import { Dialog } from "@material-ui/core";
import { getAllCategory } from "../../api";
export default function EditDiaLog(props) {
  const [editBook, setEditBook] = useState({});
  const [category, setCategory] = useState([]);
  const handleNumberInput = event => {
    const errorDiv = document.querySelector(".error");
    const reg = new RegExp("^[0-9]+$");
    if (reg.test(event.key)) {
      errorDiv.style.display = "none";
    } else {
      errorDiv.style.display = "block";
    }
  };
  useEffect(() => {
    async function fetchData() {
      const res = await getAllCategory();
      setCategory(res);
    }
    fetchData();
  }, []);
  useEffect(() => {
    setEditBook(props.book);
  }, [props]);
  const changeName = event => {
    console.log(event.target.value);
    setEditBook(prevState => {
      return { ...prevState, name: event.target.value };
    });
  };
  const changeAuthor = event => {
    console.log(event.target.value);
    setEditBook(prevState => {
      return { ...prevState, author: event.target.value };
    });
  };
  const changeAmount = event => {
    console.log(event.target.value);
    setEditBook(prevState => {
      return { ...prevState, amount: event.target.value };
    });
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
          <Option currentCategory={props.book.category} category={category}></Option>
        </div>
        <div className="input-info">
          <p className="input-header"> Amount</p>
          <input
            onBlur={changeAmount}
            onKeyPress={handleNumberInput}
            className="input"
            type="number"
            placeholder={props.book.amount}
          ></input>
        </div>

        <div className="error">Invalid input!!!</div>
        <div className="button-div">
          <button className="save-button" onClick={e => props.closeEditDialog(props.book, editBook, false)}>
            Save
          </button>
          <button className="cancle-button" onClick={e => props.closeEditDialog(null, null, true)}>
            Cancle
          </button>
        </div>
      </div>
    </Dialog>
  );
}

function Option(props) {
  const list = props.category.map(element => (
    <option key={element.id} value={element.name}>
      {element.name}
    </option>
  ));
  const selectBoxChange = event => {
    console.log(event.target.options.selectedIndex);
  };
  return (
    <select onChange={selectBoxChange} defaultValue={props.currentCategory} className="select-category">
      {list}
    </select>
  );
}
