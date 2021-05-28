import { useState, useEffect, useRef } from "react";
import { Dialog } from "@material-ui/core";
export default function AddNewBookDialog(props) {
  const [newBook, setNewBook] = useState({});
  const errorRef = useRef();
  const handleNumberInput = event => {
    const reg = new RegExp("^[0-9]+$");
    if (reg.test(event.key)) {
      errorRef.current.style.display = "none";
    } else {
      errorRef.current.style.display = "block";
    }
  };
  useEffect(() => {}, [props]);

  return (
    <Dialog open={props.openAddDialog}>
      <div className="dialog">
        <h3>Add book</h3>
        <div className="input-info">
          <p className="input-header">Name</p>
          <input className="input"></input>
        </div>

        <div className="input-info">
          <p className="input-header">Author</p>
          <input className="input"></input>
        </div>
        <div className="input-info">
          <p className="input-header">Category</p>
          <input className="input"></input>
        </div>
        <div className="input-info">
          <p className="input-header">Amount</p>
          <input onKeyPress={handleNumberInput} className="input" type="number"></input>
        </div>

        <div className="error" ref={errorRef}>
          Invalid input!!!
        </div>
        <div className="button-div">
          <button className="save-button">Add</button>
          <button onClick={e => props.closeAddDialog()} className="cancle-button">
            Cancle
          </button>
        </div>
      </div>
    </Dialog>
  );
}
