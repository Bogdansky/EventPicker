import React, { Component } from 'react';
import AddUserInfo from './AddUserInfo'
import {EventEmitter} from '../events.js'

export class Home extends Component {
  static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            nickname: localStorage.getItem('nickname'),
            userId: localStorage.getItem('userId'),
            token: localStorage.getItem('token')
        };

        this.setNickname = this.setNickname.bind(this);
        this.getGreetings = this.getGreetings.bind(this);
        this.logoutCallback = this.logoutCallback.bind(this);

        EventEmitter.subscribe("logout", this.logoutCallback);
    }

    getGreetings(){
        let person = "";

        if (!this.state.userId){
            person = "Stranger";
        } else {
            person = this.state.nickname || "Unnamed user"
        }
        return `Hello, ${person}!`;
    }

    setNickname(nickname) {
        console.log("Nickname: " + nickname);
        localStorage.setItem('nickname', nickname);
        this.setState({nickname})
    }

    logoutCallback(){
        this.setState(this.state);
    }

    render() {
    return (
        <div>
            <h1>{this.getGreetings()}</h1>
            <div className="btn-group">
                {this.state.userId ?
                    <AddUserInfo setNickname={this.setNickname} /> : ""
                }
            </div>
            <div style={{fontSize: '64px'}}>
                We glad to see you!
            </div>
      </div>
    );
  }
}
