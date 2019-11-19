import React, { Fragment } from 'react'
import { Modal } from 'react-bootstrap'

export default class UpdateBook extends React.Component {
    static displayName = UpdateBook.name;

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            byUrl: true,
            id: props.id,
            cover: props.cover
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleMethod = this.handleMethod.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.baseState = this.state;
    }

    handleOpen(e) {
        this.setState({ show: !this.state.show });
    }

    handleMethod() {
        let changeMethod = !this.state.byUrl;
        this.setState({ byUrl: changeMethod });
    }

    handleClick(e) {
        switch (e.target.id) {
            case "save":
                this.props.handleSaveCover(e);
                this.setState({ show: false});
                break;
            case "cancel":
                this.setState({ show: false });
                break;
        }
    }

    render() {
        return (
            <Fragment>
                <a className="btn btn-warning" onClick={this.handleOpen}>{this.props.exist ? "Update cover" : "Add cover"}</a>
                <Modal show={this.state.show}>
                    <Modal.Header>
                        <h1>{this.state.url ? "Enter a url of cover" : "Upload cover"}</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>
                            <h4>Cover {this.state.cover ? `(current cover: ${this.state.cover})` : ""}</h4>
                            <div className="form-row">
                                <div className="col">
                                    <div className="form-check form-check-inline">
                                        <input type="checkbox" className="todo__checkbox" id="byUpload" value={this.state.byUrl} onChange={this.handleMethod} />
                                        <label className="form-check-label" htmlFor="byUpload">Upload file</label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group" id="byUrl" hidden={!(this.state.byUrl)}>
                                        <input type="url" className="form-control" name="Cover" id="inputCover" placeholder="https://example.com/1.jpg" />
                                        <small className="form-text">Enter the url of the picture</small>
                                    </div>
                                    <div className="form-group" id="byUpload" hidden={this.state.byUrl}>
                                        <input type="file" className="form-control-file" name="File" id="uploadFile" />
                                        <small className="form-text">I think you know</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button id="save" className="btn btn-success" onClick={this.handleClick}>Save</button>
                        <button id="cancel" className="btn btn-danger" onClick={this.handleClick}>Close</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}