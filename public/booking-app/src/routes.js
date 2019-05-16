import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import Main from "./pages/Main"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home"
const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route path= "/" exact component={Main}/>
            <Route path="/dashboard" exact component={Dashboard}/>
            <Route path="/home" exact component={Home}/>
        </Switch>
    </BrowserRouter>
);

export default Routes;