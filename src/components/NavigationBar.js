/* eslint-disable jsx-a11y/alt-text */
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from 'images/among-us-avatar.png';
import { Link } from 'react-router-dom';
import { useLogin } from 'context/LoginContext';
import {
   faSignOutAlt,
   faIdBadge,
   faBell,
   faEnvelope,
   faBars,
   faCog,
   faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useTransition } from 'context/SideBarContext';

export default function NavigationBar() {
   const [openPopup, setOpenPopup] = useState(false);

   const loginContext = useLogin();

   const sidebarContext = useTransition();

   const openPopupDiv = () => {
      console.log('pop');
      setOpenPopup(!openPopup);
   };

   const openSideBar = () => {
      sidebarContext.toggleSideBarVisible();
      sidebarContext.toggleClickFromNav(true);
   };

   const logOutAccount = () => {
      setOpenPopup(!openPopup);
      loginContext.changeLoginState();
   };

   return (
      <div className="nav-bar">
         <div className="title">
            <p onClick={openSideBar}>
               <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
            </p>
            <h3>BOOK LAND</h3>
            <div onClick={openPopupDiv} className="narrow-down"></div>
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
         {openPopup && (
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
               <p onClick={logOutAccount}>
                  <FontAwesomeIcon icon={faSignOutAlt}></FontAwesomeIcon>Logout
               </p>
            </div>
         )}
      </div>
   );
}
