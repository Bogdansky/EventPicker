import React, { Fragment } from 'react'
import { Modal, Button, ButtonToolbar } from 'react-bootstrap'

export default class AddMarkerInfo extends React.Component {
    static displayName = AddMarkerInfo.name;

    constructor(props){
        super(props);

        this.state = {
            status: "add",
            shown: false,
            title: "",
            description: "",
            category: "",
            imageUrl: "https://bankoboev.ru/storage/thumbnail/bankoboev.ru-155581.jpg"
        }

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setUpdates = this.setUpdates.bind(this);
    }

    showModal(){
        this.setState({shown: true});
    }

    hideModal(){
        this.setState({shown: false});
    }

    setUpdates(){
        const info = {
            title: this.state.title,
            description:this.state.description,
            category:this.state.category,
            imageUrl:this.state.imageUrl,
        }
        console.log(info);
        this.props.setInfo(info, this.hideModal);
    }

    onChange(e){
        switch(e.target.name){
            case "title":
                this.setState({title: e.target.value});
                break;
            case "description":
                this.setState({description: e.target.value});
                break;
            case "category":
                this.setState({category: e.target.value});
                break;
            default:
                break;
        }
    }

    render(){
        return (
            <Fragment>
                <Button onClick={this.showModal}>{this.state.status === "add" ? "Add info" : "Modify info"}</Button>
                <Modal show={this.state.shown} onHide={this.hideModal}>
                    <Modal.Header>
                        <h2>{this.state.title || "Empty"}</h2>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="col">
                                <label htmlFor="inputName">Title</label>
                                <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.onChange} placeholder="Title" required/>
                                <small id="emailHelp" className="form-text text-muted">Enter title</small>
                            </div>
                            <div className="col">
                                <label htmlFor="inputAuthor">Description</label>
                                <input type="text" className="form-control" name="description" placeholder="Description" value={this.state.description} onChange={this.onChange} required />
                                <small id="emailHelp" className="form-text text-muted">Enter description</small>
                            </div>
                            <div className="col">
                                <label htmlFor="inputNumber">Category</label>
                                <input type="text" className="form-control" name="category" placeholder="Pups" value={this.state.category} onChange={this.onChange} required />
                                <small id="emailHelp" className="form-text text-muted">Enter category</small>
                            </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonToolbar>
                            <Button variant="success" onClick={this.setUpdates}>Save</Button>
                            <Button variant="danger" onClick={this.hideModal}>Cancel</Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}