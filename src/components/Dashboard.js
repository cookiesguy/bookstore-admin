import { Switch, Route } from 'react-router-dom';
import { Dialog, Button } from '@material-ui/core';
import { useState } from 'react';
import { useLogin } from 'context/LoginContext';
import { userLogin } from 'api/authen';
import Books from './books';
import Setting from './settings';
import Order from './orders';
import NotFound from './404';
import Customer from './customer';

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
                        <p>Total user online</p>
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
