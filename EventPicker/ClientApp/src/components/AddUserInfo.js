import React, { Component, Fragment } from 'react';
import { Modal } from 'react-bootstrap'

export default class AddUserInfo extends Component {
    static displayName = AddUserInfo.name;

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            surname: '',
            show: false
        }

        this.onChange = this.onChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    onChange(e) {
        if (e.target.name === "name") {
            this.setState({
                name: e.target.value
            });
        } else {
            this.setState({
                surname: e.target.value
            });
        }
    }

    handleOpen(e) {
        this.setState({ show: !this.state.show });
    }

    handleClose(e) {
        this.setState({ show: false });
    }

    handleSave() {
        let body = JSON.stringify({
            "name": this.state.name,
            "surname": this.state.surname
        });
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body
        };
        var userId = localStorage.getItem('userId') || 0;
        fetch(`https://reading-organizer.azurewebsites.net/api/userinfo/${userId}`, options)
            .then(res => res.json())
            .then(res => {
                if (res.statusCode) {
                    res = null;
                }
                this.setState({ show: false }, this.props.setUserInfo(res));
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        return (
            <Fragment>
                <a className="btn btn-special" onClick={this.handleOpen}>Rename</a>
                <Modal show={this.state.show}>
                    <Modal.Header>
                        <h3>Enter user information</h3>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="col-12" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label className="form-text">Name</label>
                                <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.onChange} placeholder="Name" required />
                            </div>
                            <div className="form-group">
                                <label className="form-text">Surname</label>
                                <input type="text" className="form-control" name="surname" value={this.state.surname} onChange={this.onChange} placeholder="Surname" required />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-success" onClick={this.handleSave}>Save</button>
                        <button className="btn btn-danger" onClick={this.handleClose}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
            );
    }
}