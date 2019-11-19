import React from 'react'
import { Route, Redirect } from 'react-router'
import './Form.css'

export class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loggedIn: false,
            error: {}
        }

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        try {
            let body = JSON.stringify({
                "email": this.state.email,
                "password": this.state.password
            });
            console.log(body);
            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: 'cors',
                body
            };
            fetch(`https://reading-organizer.azurewebsites.net/api/users/signin`, options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.token) {
                    localStorage.setItem("userId", data.id);
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userinfo", JSON.stringify(data.userInfo));
                    this.setState({ loggedIn: true });

                } else if (data.statusCode && data.message) {
                    this.setState({error: data})
                }
            })
            .catch(error => {
                console.log(error);
                    this.setState({
                        error: {
                            message: "Some problems with connection",
                            statusCode: 500
                        }
                    });
            });
        }
        catch (e) {
            this.setState({
                error: {
                    message: "Some problems with connection",
                    statusCode: 500
                }
            });
            console.log('ќшибка');
        }
    }

    onChange(e) {
        if (e.target.type === "email")
            this.setState({
                email: e.target.value
            })
        else if (e.target.type === "password") {
            this.setState({
                password: e.target.value
            });
        }

    }

    render() {
        return this.state.loggedIn ?
            (<Redirect to='/' />)
            : 
            (
                <div className="pad">
                    <form className="box" onSubmit={this.handleSubmit}>
                        <h1>Login</h1>
                        <input type="email" value={this.state.email} onChange={this.onChange} placeholder="example@mail.com" required />
                        <input type="password" value={this.state.password} onChange={this.onChange} placeholder="password" required />
                        <div className="error" hidden={!this.state.error.message}>
                            <p>{this.state.error.statusCode}. {this.state.error.message}</p>
                        </div>
                        <button className="btn btn-warning" type="submit">Log in</button>
                    </form>
                </div>
            );
    }
}