import React from 'react'
import {Redirect} from 'react-router'

export class Logout extends React.Component {
    static displayName = Logout.name;

    constructor(props){
        super(props);

        localStorage.removeItem("userId");
        localStorage.removeItem("nickname");
    }

    render(){
        return (
            <Redirect to="/signup"/>
        );
    }
}