import logo from "./logo.svg";
import "./App.css";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { AdminTemplate } from "./template/AdminTemplate/AdminTemplate";
import Meal from "./page/Meal/Meal";
import Exercises from "./page/Exercises/Exercises";
import User from "./page/User/User";
import PlanWorkout from "./page/PlanWorkout/PlanWorkout";
import Login from "./page/Login/Login";
import Category from "./page/Category/Category";

export const history = createBrowserHistory();
function App() {
  return (
    <Router history={history}>
      <Switch>
        <AdminTemplate exact path="/meal" Component={Meal} />
        <AdminTemplate exact path="/exercises" Component={Exercises} />
        <AdminTemplate exact path="/user" Component={User} />
        <AdminTemplate exact path="/planworkout" Component={PlanWorkout} />
        <AdminTemplate exact path="/category" Component={Category} />
        <Route exact path="/" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
