import React, { Component } from 'react';
import AddUserInfo from './AddUserInfo'

export class Home extends Component {
  static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            userInfo: JSON.parse(localStorage.getItem('userinfo')),
            userId: localStorage.getItem('userId'),
            token: localStorage.getItem('token')
        };

        this.setUserInfo = this.setUserInfo.bind(this);
    }

    setUserInfo(info) {
        console.log(info.name);
        localStorage.setItem('userinfo', JSON.stringify(info));
        this.setState({ userInfo: info });
    }

    render() {
        console.log(this.state.userInfo);
    return (
        <div>
            <h1>Hello{this.state.userId && this.state.userInfo ? this.state.userInfo.name && this.state.userInfo.surname ? `, ${this.state.userInfo.name} ${this.state.userInfo.surname}` : ', Unnamed User' : ', stranger'}!</h1>
            <div className="btn-group">
                {this.state.userId && !this.state.userInfo ?
                    <AddUserInfo setUserInfo={this.setUserInfo} /> : ""
                }
            </div>
            <div>
                This application is task manager for those who love to read books and wants to organize their enjoying.<br/>
                To start you may to click on "Library" to choose book what you want to read. Or click on "My books" if you choice book.<br/>
                Of course, you need to log in or sign up in the system to track your progress at reading books.
                Your progress you can watch in section what calls "My books".
                There are all books that you start to read. System automaticaly build your plan so you don't care about it.
                If you entered in "My books" you can see covers of books. Click on book which you like to read, enter number of days and click "Read".
            </div>
      </div>
    );
  }
}
