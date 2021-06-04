import { useState, useEffect, useRef } from "react";
import { Dialog } from "@material-ui/core";
import Option from "./CategoryDialog";
import { getConfigItem } from "../../api/settings";
import { VoiceOverOffSharp } from "@material-ui/icons";

export default function EditDiaLog(props) {
  const [editBook, setEditBook] = useState({
    category: {
      name: "",
    },
  });
  const [category, setCategory] = useState([]);
  const [tempAmount, setTempAmount] = useState(0);
  const [minimumImportBook, setMinimumImportBook] = useState({});
  const [maximumBook, setMaximumBook] = useState({});
  const errorRef = useRef();
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
  const changeAmount = () => {
    if (tempAmount < minimumImportBook.value && tempAmount > 0 && minimumImportBook.status) {
      errorRef.current.style.display = "block";
      return;
    }
    let value = tempAmount + editBook.amount;
    if (value > maximumBook.value && maximumBook.status) {
      errorRef.current.style.display = "block";
      return;
    }
    errorRef.current.style.display = "none";
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
      errorRef.current.style.display = "none";
      setTempAmount(parseInt(event.target.value));
      return true;
    } else {
      errorRef.current.style.display = "block";
      return false;
    }
  };
  const checkBookInfoValid = () => {
    if (!checkStringValid(editBook.name) || !checkStringValid(editBook.author)) {
      errorRef.current.style.display = "block";
      return false;
    } else {
      errorRef.current.style.display = "none";
      return true;
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

  const closeDialog = isCancel => {
    if (isCancel) {
      setEditBook(prevState => {
        return { ...prevState, amount: props.book.amount };
      });
      props.closeEditDialog(null, null, true);
    } else {
      if (checkBookInfoValid()) {
        props.closeEditDialog(null, editBook, false);
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

        <div ref={errorRef} className="error">
          Invalid input, please check all condition
        </div>
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
