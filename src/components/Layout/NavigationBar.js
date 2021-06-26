/* eslint-disable jsx-a11y/alt-text */
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useLogin } from 'Context/LoginContext';
import {
   faSignOutAlt,
   faIdBadge,
   faBell,
   faEnvelope,
   faBars,
   faCog,
   faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import Avatar from 'Images/among-us-avatar.png';
import { useTransition } from 'Context/SideBarContext';

export default function NavigationBar() {
   const [openPopup, setOpenPopup] = useState(false);

   const loginContext = useLogin();

   const sidebarContext = useTransition();

   const isSmallScreen = useMediaQuery({ query: ' (max-width: 440px) ' });

   const openPopupDiv = () => {
      setOpenPopup(!openPopup);
   };

   const openSideBar = () => {
      sidebarContext.toggleSideBarVisible(!useTransition.isVisible);
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
         </ul>
         <div className="image" onClick={openPopupDiv}>
            <img src={Avatar} className="avatar"></img>
         </div>
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
               {isSmallScreen && (
                  <div className="popup-link">
                     <Link to="/">
                        <p>
                           <FontAwesomeIcon
                              icon={faTachometerAlt}
                           ></FontAwesomeIcon>
                           <span>Dashboard</span>
                        </p>
                     </Link>
                     <Link to="/settings">
                        <p>
                           <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
                           <span>Setting</span>
                        </p>
                     </Link>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
