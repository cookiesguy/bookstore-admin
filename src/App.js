import Dashboard from 'components/Dashboard';
import NavigationBar from 'components/NavigationBar';
import Sidebar from 'components/Sidebar';
import SideBarProvider, { useTransition } from 'context/SideBarContext';

function App() {
   const closeSideBar = () => {
      useTransition.toggleSideBarVisible();
   };

   return (
      <div className="App">
         <SideBarProvider>
            <div onClick={closeSideBar} className="disable-div"></div>
            <NavigationBar></NavigationBar>
            <div className="body">
               <Sidebar></Sidebar>
               <Dashboard></Dashboard>
            </div>
         </SideBarProvider>
      </div>
   );
}

export default App;
