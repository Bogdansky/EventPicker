import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Feed } from './components/feed/Feed';
import { SignUp } from './components/SignUp'
import { SignIn } from './components/SignIn'
import { Error } from './components/Error'
import { Maps } from './components/Maps'
import './App.css'
import {EventEmitter} from './events.js'

export default class App extends Component {
  static displayName = App.name;

  constructor(props) {
      super(props);

      this.logout = this.logout.bind(this);
  }

  logout(){
      localStorage.removeItem("userId");
      localStorage.removeItem("nickname");
      localStorage.removeItem("token");
      window.location.reload();
  }
  render () {
    return (
      <Layout onLogout={this.logout}>
            <Route exact path='/' component={Home} />
            <Route path='/events' component={Feed} />
            <Route path='/map' component={Maps} />
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
            <Route path='/error' component={Error} />
      </Layout>
    );
  }
}
