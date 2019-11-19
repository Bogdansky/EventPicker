import React from 'react'
import './Error.css'

export class Error extends React.Component {
    static displayName = Error.name;

    constructor(props) {
        super(props);

        this.state = {
            statusCode: localStorage.getItem("statusCode"),
            message: localStorage.getItem("message")
        };

    }

    render() {
        return (
            <div className="errorBody">
                <div id="titles">
                    <div id="titlecontent">
                        <p>{this.state.statusCode}. {this.state.message}</p>
                    </div>
                </div>
            </div>  
        );
    }
}