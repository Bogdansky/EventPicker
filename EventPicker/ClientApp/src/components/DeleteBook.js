import React, { Fragment } from 'react'
import { Modal } from 'react-bootstrap'
import $ from 'jquery'

export default class DeleteBook extends React.Component {
    static displayName = DeleteBook.name;

    constructor(props) {
        super(props);

        this.state = {
            show: false
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
    }

    handleOpen() {
        this.setState({ show: true });
    }

    handleClick(e) {
        switch (e.target.id) {
            case "yes":
                this.deleteBook(this.props.bookId);
                break;
            case "no":
                break;
        }
        this.setState({ show: false });
    }

    deleteBook(id) {
        $.ajax({
            type: "DELETE",
            url: `https://reading-organizer.azurewebsites.net/api/books/${id}`,
            contentType: "application/json",
            success: res => {
                console.log(JSON.stringify(res));
                this.setState({ show: false }, this.props.remove(res));
            },
            error: data => console.log(data)
        })
    }

    render() {
        return (
            <Fragment>
                <a className="btn btn-warning" onClick={this.handleOpen}>Delete book</a>
                <Modal show={this.state.show}>
                    <Modal.Header>
                        <h1>{this.state.url ? "Enter a url of cover" : "Upload cover"}</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <label>You sure?</label>
                    </Modal.Body>
                    <Modal.Footer>
                        <button id="yes" className="btn btn-success" onClick={this.handleClick}>Yes</button>
                        <button id="no" className="btn btn-danger" onClick={this.handleClick}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}