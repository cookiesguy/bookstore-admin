import { useState } from "react";
import { Dialog } from "@material-ui/core";
import { removeAscent } from "../../helper/vietnameseValidate";
export default function AddCustomerDialog(props) {
  const [newCustomer, setNewCustomer] = useState({});
  const [errorMessage, setErrorMessage] = useState({ isDisplay: false, message: "" });
  const changeName = event => {
    setNewCustomer(prevState => {
      return {
        ...prevState,
        name: event.target.value,
      };
    });
  };
  const changeAddress = event => {
    setNewCustomer(prevState => {
      return {
        ...prevState,
        address: event.target.value,
      };
    });
  };
  const changePhoneNumber = event => {
    setNewCustomer(prevState => {
      return {
        ...prevState,
        phone: event.target.value,
      };
    });
  };
  const changeEmail = event => {
    setNewCustomer(prevState => {
      return {
        ...prevState,
        email: event.target.value,
      };
    });
  };
  const checkValidAddressAndName = () => {
    const regex = /[^A-Za-z0-9]+/g;
    if (
      regex.test(removeAscent(newCustomer.name)) ||
      regex.test(removeAscent(newCustomer.address)) ||
      newCustomer.address === "" ||
      newCustomer.name === ""
    ) {
      setErrorMessage({ isDisplay: true, message: "Invalid name or address" });
      return false;
    }
    setErrorMessage({ isDisplay: false, message: "" });
    return true;
  };
  const checkValidEmail = () => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;
    if (regex.test(newCustomer.email)) {
      setErrorMessage({ isDisplay: false, message: "" });
      return true;
    }
    setErrorMessage({ isDisplay: true, message: "Invalid email address" });
  };
  const checkValidPhoneNumber = () => {
    const regex = new RegExp("^[0-9]*$");
    if (regex.test(newCustomer.phone)) {
      setErrorMessage({ isDisplay: false, message: "" });
      return true;
    }
    setErrorMessage({ isDisplay: true, message: "Invalid phone number" });
  };
  const closeDialog = () => {
    if (checkValidEmail() && checkValidPhoneNumber() && checkValidAddressAndName()) {
      props.closeAddDialog(newCustomer, false);
    }
  };
  return (
    <Dialog open={props.openAddDialog}>
      <div className="dialog">
        <h3>Add customer</h3>
        <div className="input-info">
          <p className="input-header">Name</p>
          <input onBlur={changeName} className="input"></input>
        </div>
        <div className="input-info">
          <p className="input-header">Address</p>
          <input onBlur={changeAddress} className="input"></input>
        </div>
        <div className="input-info">
          <p className="input-header">Phone</p>
          <input onBlur={changePhoneNumber} className="input"></input>
        </div>
        <div className="input-info">
          <p className="input-header">Email</p>
          <input onBlur={changeEmail} className="input"></input>
        </div>
        {errorMessage.isDisplay && <div className="error">{errorMessage.message}</div>}
        <div className="button-div">
          <button className="save-button" onClick={closeDialog}>
            Add
          </button>
          <button className="cancle-button" onClick={e => props.closeAddDialog(null, true)}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}
