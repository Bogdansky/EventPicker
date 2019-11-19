import React from 'react'
import { Redirect } from 'react-router'
import Library from './Library'
import Board from './Board'
import './Main.css'

export class Main extends React.Component {
    static displayName = Main.name;

    constructor(props){
        super(props);
        
        this.state = {
            userId: localStorage.getItem("userId"),
            token: localStorage.getItem("token"),
            bookProgress: [],
            error: null
        };

        this.loadProgress = this.loadProgress.bind(this);
        this.handleError = this.handleError.bind(this);
        this.changeOrderOfSorting = this.changeOrderOfSorting.bind(this);

        this.loadProgress();
    }

    loadProgress(sortBy = "name") {
        if (!this.state.userId || this.state.userId < 1) {
            return;
        }

        let authorizationHeader = { "Authorization": `Bearer ${this.state.token}` };
        let options = {
            method: "GET",
            mode: 'cors',   
            headers: authorizationHeader
        };

        fetch(`https://reading-organizer.azurewebsites.net/api/users/${this.state.userId}/books?sort=${sortBy}`, options)
            .then(response => {
                if (response.status > 399) {
                    this.handleError(response.status, response.statusText);
                }
                return response;
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.Message && data.StatusCode) {
                    this.setState({
                        error: true
                    });
                    localStorage.setItem("statusCode", data.StatusCode);
                    localStorage.setItem("message", data.Message);
                } else {
                    this.setState({
                        bookProgress: data.bookProgress
                    });
                }
            })
            .catch(error => console.log(error));    
    }

    changeOrderOfSorting(e) {
        this.loadProgress(e.target.value);
    }

    handleError(statusCode, message) {
        localStorage.setItem("statusCode", statusCode);
        localStorage.setItem("message", message);
        this.setState({ error: true });
    }

    render() {
        if (!this.state.userId) return (
            <Redirect to='/signin' />
        );

        return this.state.bookProgress.length == 0
            ?
            <div>
                You not reading anything yet. Maybe you would want to choose some from this.
                <Library key={new Date().getMilliseconds()} />
            </div>
            :
            <div id="boards">
                <div className="d-flex">
                    <label style={{marginRight: '10px'}}>Sort by</label>
                    <div className="custom-control custom-radio">
                        <input id="sortname" type="radio" className="custom-control-input" name="sortorder" value="name" onClick={this.changeOrderOfSorting} defaultChecked />
                        <label className="custom-control-label" htmlFor="sortname">Book name</label>
                    </div>
                    <div className="custom-control custom-radio">
                        <input id="sortprogress" type="radio" className="custom-control-input" name="sortorder" value="progress" onClick={this.changeOrderOfSorting}/>
                        <label className="custom-control-label" htmlFor="sortprogress">Read progress</label>
                    </div>
                </div>
                {this.state.bookProgress.map(p => {
                    return <Board key={p.book.id} userId={this.state.userId} book={p.book} progress={p.progress} />
                })}
                <button></button>
            </div>
    }
}