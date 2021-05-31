import DashBoard from "./components/DashBoard";
import NavigationBar from "./components/NaviogationBar";
import SideBar from "./components/SideBar";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faSignOutAlt, faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoginUpdate } from "./context/LoginContext";

function App() {
  const closeSideBar = () => {
    const sidebar = document.querySelector(".side-bar");
    sidebar.style.transform = "translateX(-400px)";
    document.querySelector(".disable-div").style.display = "none";
  };
  const logOut = useLoginUpdate();
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
        <p onClick={logOut}>
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
