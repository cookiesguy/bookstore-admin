import { Switch, Route } from "react-router-dom";
import Books from "./books";
import Setting from "./settings";
export default function DashBoard() {
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
        <Route></Route>
      </Switch>
    </div>
  );
}
