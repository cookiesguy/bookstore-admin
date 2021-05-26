import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
export default function SideBar() {
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
          <h3>BOOKLAND</h3>
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
      <div className="side-bar-item">
        <div>
          <FontAwesomeIcon icon={faUserFriends}></FontAwesomeIcon>
          <span>User</span>
        </div>
      </div>
      <div className="side-bar-item">
        <div>
          <FontAwesomeIcon icon={faWallet}></FontAwesomeIcon>
          <span>Order</span>
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
