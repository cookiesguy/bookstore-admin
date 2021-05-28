/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import { faBars, faChevronDown, faCog } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../images/amongusavatat.png";
export default function NavigationBar() {
  const [openPopup, setOpenPopup] = useState(false);
  const openPopupDiv = () => {
    setOpenPopup(!openPopup);
    if (openPopup) {
      document.querySelector(".pop-up-account").style.display = "none";
      document.querySelector("#narrow-icon").style.transform = "rotate(360deg)";
    } else {
      document.querySelector(".pop-up-account").style.display = "flex";
      document.querySelector("#narrow-icon").style.transform = "rotate(180deg)";
    }
  };

  const openSideBar = () => {
    const sidebar = document.querySelector(".side-bar");
    sidebar.style.display = "block";
    sidebar.style.transform = "translateX(0px)";
    document.querySelector(".disable-div").style.display = "block";
  };
  return (
    <div className="nav-bar">
      <div className="title">
        <p onClick={openSideBar}>
          <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
        </p>
        <h3>BOOKLAND</h3>
        <div onClick={openPopupDiv} className="narrow-down">
          <FontAwesomeIcon id="narrow-icon" icon={faChevronDown}></FontAwesomeIcon>
        </div>
      </div>

      <ul>
        <li>
          <FontAwesomeIcon icon={faTachometerAlt}></FontAwesomeIcon>
          <span>Dashboard</span>
        </li>
        <li>
          <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
          <span>Setting</span>
        </li>
        <li onClick={openPopupDiv}>
          <img src={Avatar} className="avatar"></img>
        </li>
      </ul>
    </div>
  );
}
