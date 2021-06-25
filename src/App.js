import Dashboard from 'components/Layout/Dashboard';
import NavigationBar from 'components/Layout/NavigationBar';
import Sidebar from 'components/Layout/Sidebar';
import { useTransition } from 'Context/SideBarContext';

function App() {
   const sideBarContext = useTransition();

   const closeSideBar = () => {
      sideBarContext.toggleSideBarVisible(false);
   };

   return (
      <div className="App">
         {sideBarContext.isVisible && (
            <div onClick={closeSideBar} className="disable-div"></div>
         )}
         <NavigationBar></NavigationBar>
         <div className="body">
            <Sidebar></Sidebar>
            <Dashboard></Dashboard>
         </div>
      </div>
   );
}

export default App;
