import React from 'react';
import './App.css';
import {decorate, observable} from "mobx"
import {observer} from "mobx-react"

import Routes from './routes'

const App = () => <Routes/>

export default App;
