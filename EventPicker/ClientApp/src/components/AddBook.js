import React, { Fragment } from 'react'
import $ from 'jquery'
import { Modal } from 'react-bootstrap'
import { Redirect } from 'react-router'

export default class AddBook extends React.Component {
    static displayName = AddBook.name;

    constructor(props) {
        super(props);

        this.state = {
            show: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen(e) {
        this.setState({ show: true });
    }

    handleClose(e) {
        this.setState({ show: false });
    }

    handleSubmit(e) {
        //
        e.preventDefault();
        let name = document.getElementById("inputName").value,
            author = document.getElementById("inputAuthor").value,
            pages = document.getElementById("inputPages").value;

        let body = {
            "Name": name,
            "Author": author,
            "Cover": "",
            "NumberOfPages": pages
        }

        if (!name || name == "") {
            $("#error_message").text("Name must be not empty");
            return;
        } else if (!author || author == "") {
            $("#error_message").text("Author must be not empty");
            return;
        } else if (!pages) {
            $("#error_message").text("Number of pages must be not empty");
            return;
        }

        $.ajax({
            type: "POST",
            url: "https://reading-organizer.azurewebsites.net/api/books",
            data: JSON.stringify(body),
            dataType: "json",
            contentType: "application/json",
            success: res => this.setState({ show: false }, this.props.add(res)),
            error: data => console.log(data)
        })
    }

    render() {
        return (
            <Fragment>
                <button className="btn btn-special" id="add-books-tab" onClick={this.handleOpen}>Add book</button>
                <Modal show={this.state.show} onHide={() => this.setState({shown:false})}>
                    <Modal.Header>
                        <h3>Enter the info in fields and click Save</h3>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="col">
                                <label htmlFor="inputName">Book name</label>
                                <input type="text" className="form-control" id="inputName" name="Name" placeholder="Name" required/>
                                <small id="emailHelp" className="form-text text-muted">Enter name of book</small>
                            </div>
                            <div className="col">
                                <label htmlFor="inputAuthor">Author</label>
                                <input type="text" className="form-control" id="inputAuthor" name="Author" placeholder="Name" required />
                                <small id="emailHelp" className="form-text text-muted">Enter author of book</small>
                            </div>
                            <div className="col">
                                <label htmlFor="inputNumber">Number of pages</label>
                                <input type="number" min="1" className="form-control" id="inputPages" name="NumberOfPages" placeholder="111" required />
                                <small className="form-text text-muted">Number of pages</small>
                            </div>
                            <div id="errors">
                                <p id="error_message"></p>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.handleSubmit} className="btn btn-success">Save</button>
                        <button onClick={this.handleClose} className="btn btn-danger">Close</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
            );
    }
}