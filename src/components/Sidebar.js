import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
export default function Sidebar() {
  const handleRedirect = () => {
    const width = document.body.clientWidth;
    if (width < 600) {
      const sidebar = document.querySelector(".side-bar");
      sidebar.style.transform = "translateX(-400px)";
      document.querySelector(".disable-div").style.display = "none";
    }
  };
  return (
    <div className="side-bar">
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
      <div className="side-bar-item">
        <div>
          <FontAwesomeIcon icon={faListAlt}></FontAwesomeIcon>
          <span>Category</span>
        </div>
      </div>
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
          <FontAwesomeIcon icon={faChartLine}></FontAwesomeIcon>
          <span>Statistic</span>
        </div>
      </div>
    </div>
  );
}
