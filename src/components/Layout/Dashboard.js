import { Switch, Route } from 'react-router-dom';
import { Dialog, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useLogin } from 'Context/LoginContext';
import { userLogin } from 'api/authen';
import Books from 'components/Book';
import Setting from 'components/Setting';
import Order from 'components/Order';
import Customer from 'components/Customer';
import NotFound from 'components/Layout/NotFound';
import Payment from 'components/Payment';
import Statistic from 'components/Statistic';

export default function Dashboard() {
   const [username, setUserName] = useState('');

   const [password, setPassword] = useState('');

   const [disabledBtn, setDisabledBtn] = useState(false);

   const loginContext = useLogin();

   const changeUserName = event => {
      setUserName(event.target.value);
   };

   const changePassword = event => {
      setPassword(event.target.value);
   };

   const tryLogin = async () => {
      if (username === 'admin' && password === '1234') {
         setDisabledBtn(true);
         const res = await userLogin();
         console.log(res);
         loginContext.changeLoginState();
         setDisabledBtn(false);
      } else {
         alert('Wrong user name or password');
      }
   };

   return (
      <div className="dash-board">
         {loginContext.login === true ? (
            <Switch>
               <Route exact path="/">
                  <div className="access">
                     <div className="card">
                        <FontAwesomeIcon size={'10x'} icon={faBook} />
                        <h1 style={{ marginLeft: '60px' }}>
                           WELCOME TO BOOK STORE
                        </h1>
                     </div>
                  </div>
               </Route>
               <Route path="/books">
                  <Books></Books>
               </Route>
               <Route path="/settings">
                  <Setting></Setting>
               </Route>
               <Route path="/order">
                  <Order></Order>
               </Route>
               <Route path="/customer">
                  <Customer></Customer>
               </Route>
               <Route path="/payment">
                  <Payment></Payment>
               </Route>
               <Route path="/statistic">
                  <Statistic></Statistic>
               </Route>
               <Route>
                  <NotFound></NotFound>
               </Route>
            </Switch>
         ) : (
            <Dialog open={true}>
               <div className="login-dialog">
                  <h3>Login to store</h3>
                  <div className="input-credential">
                     <input
                        onBlur={changeUserName}
                        placeholder="username"
                     ></input>
                     <input
                        onBlur={changePassword}
                        placeholder="password"
                        type="password"
                     ></input>
                  </div>

                  <Button
                     disabled={disabledBtn}
                     onClick={tryLogin}
                     variant="contained"
                     color="primary"
                  >
                     login
                  </Button>
               </div>
            </Dialog>
         )}
      </div>
   );
}
