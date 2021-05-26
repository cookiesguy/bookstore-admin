import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
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
        <li>Dashboard</li>
        <li>Setting</li>
        <li onClick={openPopupDiv}>
          <img src={Avatar} className="avatar"></img>
        </li>
      </ul>
      <div className="pop-up-account">
        <p>
          <FontAwesomeIcon icon={faIdBadge}></FontAwesomeIcon>Profile
        </p>
        <p>
          <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>Message
        </p>
        <p>
          <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>Notification
        </p>
        <p>
          <FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon>Logout
        </p>
      </div>
    </div>
  );
}
