import DashBoard from "./components/dashboard";
import NavigationBar from "./components/navbar";
import SideBar from "./components/sidebar";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  const closeSideBar = () => {
    const sidebar = document.querySelector(".side-bar");
    sidebar.style.transform = "translateX(-400px)";
    document.querySelector(".disable-div").style.display = "none";
  };
  return (
    <div className="App">
      <div onClick={closeSideBar} className="disable-div"></div>
      <NavigationBar></NavigationBar>
      <div className="body">
        <SideBar></SideBar>
        <DashBoard></DashBoard>
      </div>
    </div>
  );
}

export default App;
