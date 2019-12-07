import React, { Component, Fragment } from 'react';
import { Modal } from 'react-bootstrap'

export default class AddUserInfo extends Component {
    static displayName = AddUserInfo.name;

    constructor(props) {
        super(props);

        this.state = {
            nickname: '',
            show: false
        }

        this.onChange = this.onChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    onChange(e) {
        this.setState({nickname: e.target.value});
    }

    handleOpen(e) {
        this.setState({ show: !this.state.show });
    }

    handleClose(e) {
        this.setState({ show: false });
    }

    handleSave() {
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickname: this.state.nickname
            })
        };
        var userId = localStorage.getItem('userId') || 0;
        fetch(`/api/users/${userId}`, options)
            .then(res => res.json())
            .then(res => {
                if (res.statusCode) {
                    res = null;
                }
                this.setState({ show: false }, this.props.setNickname(this.state.nickname));
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
                                <input type="text" className="form-control" name="nickname" value={this.state.nickname} onChange={this.onChange} placeholder="Name" required />
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