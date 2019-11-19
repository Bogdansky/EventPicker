import React from 'react'
import {
    BrowserRouter,
    Router,
    Switch
} from 'react-router-dom'

import Login from './Login';
import Register from './Register';

export default () => {
    <BrowserRouter>
        <Switch>
            <Route exact path="/api/users/signin" render={props => <Login {...props} />}/>
            <Route exact path="/api/users/signup" render={props => <Register {...props} />}/>
        </Switch>
    </BrowserRouter>
}