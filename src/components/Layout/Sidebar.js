/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import {
   faChartLine,
   faWallet,
   faUserFriends,
   faBook,
   faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { useTransition } from 'Context/SideBarContext';

export default function Sidebar() {
   const sidebarContext = useTransition();

   const isBigScreen = useMediaQuery({ query: '(min-width: 610px)' });

   const handleRedirect = () => {
      if (!isBigScreen) {
         sidebarContext.toggleSideBarVisible();
      }
   };

   useEffect(() => {
      if (isBigScreen) sidebarContext.toggleSideBarVisible(false);
   }, [isBigScreen]);

   return (
      <div
         className={`${
            isBigScreen || sidebarContext.isVisible
               ? 'sidebar-visible'
               : 'sidebar-un-visible'
         }`}
      >
         <Link to="/" onClick={handleRedirect}>
            <div className="side-bar-header">
               <h3>BOOK STORE</h3>
            </div>
         </Link>
         <Link to="/books" onClick={handleRedirect}>
            <div className="side-bar-item">
               <div>
                  <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>
                  <span>Books</span>
               </div>
            </div>
         </Link>

         <Link to="/customer" onClick={handleRedirect}>
            <div className="side-bar-item">
               <div>
                  <FontAwesomeIcon icon={faUserFriends}></FontAwesomeIcon>
                  <span>Customer</span>
               </div>
            </div>
         </Link>
         <Link to="/order" onClick={handleRedirect}>
            <div className="side-bar-item">
               <div>
                  <FontAwesomeIcon icon={faWallet}></FontAwesomeIcon>
                  <span>Order</span>
               </div>
            </div>
         </Link>
         <div className="side-bar-item">
            <div>
               <FontAwesomeIcon icon={faMoneyBill}></FontAwesomeIcon>
               <span>Payment</span>
            </div>
         </div>
         <div className="side-bar-item">
            <div>
               <FontAwesomeIcon icon={faChartLine}></FontAwesomeIcon>
               <span>Statistic</span>
            </div>
         </div>
      </div>
   );
}
