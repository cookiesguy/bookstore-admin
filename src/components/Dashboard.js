import { Switch, Route } from "react-router-dom";
import Books from "./books";
import Login from "./Login";
import Setting from "./settings";
import Order from "./orders";
import Customer from "./customer/index";

export default function Dashboard() {
  return (
    <div className="dash-board">
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
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/order">
          <Order></Order>
        </Route>
        <Route path="/customer">
          <Customer></Customer>
        </Route>
      </Switch>
    </div>
  );
}
