import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import Main from "./pages/Main"
import Dashboard from "./pages/Dashboard"
import Booking from "./pages/Booking/Booking"

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route path= "/" exact component={Main}/>
            <Route path="/dashboard" exact component={Dashboard}/>
            <Route path="/booking" exact component={Booking}/>
        </Switch>
    </BrowserRouter>
);

export default Routes;