import DashBoard from "./components/dashboard";
import NavigationBar from "./components/navbar";
import SideBar from "./components/sidebar";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faSignOutAlt, faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function App() {
  const closeSideBar = () => {
    const sidebar = document.querySelector(".side-bar");
    sidebar.style.transform = "translateX(-400px)";
    document.querySelector(".disable-div").style.display = "none";
  };
  return (
    <div className="App">
      <div onClick={closeSideBar} className="disable-div"></div>
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
      <NavigationBar></NavigationBar>
      <div className="body">
        <SideBar></SideBar>
        <DashBoard></DashBoard>
      </div>
    </div>
  );
}

export default App;
