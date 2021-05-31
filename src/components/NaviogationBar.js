/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import { faBars, faChevronRight, faCog } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../images/amongusavatat.png";
import { Link } from "react-router-dom";
export default function NavigationBar() {
  const [openPopup, setOpenPopup] = useState(false);
  const openPopupDiv = () => {
    setOpenPopup(!openPopup);
    if (openPopup) {
      document.querySelector(".pop-up-account").style.display = "none";
      document.querySelector("#narrow-icon").style.transform = "rotate(-2deg)";
    } else {
      document.querySelector(".pop-up-account").style.display = "flex";
      document.querySelector("#narrow-icon").style.transform = "rotate(90deg)";
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
          <FontAwesomeIcon id="narrow-icon" icon={faChevronRight}></FontAwesomeIcon>
        </div>
      </div>

      <ul>
        <Link to="/">
          <li>
            <FontAwesomeIcon icon={faTachometerAlt}></FontAwesomeIcon>
            <span>Dashboard</span>
          </li>
        </Link>
        <Link to="/settings">
          <li>
            <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
            <span>Setting</span>
          </li>
        </Link>
        <li onClick={openPopupDiv}>
          <img src={Avatar} className="avatar"></img>
        </li>
      </ul>
    </div>
  );
}
