import React, { Fragment } from 'react'
import { Modal, Button, ButtonToolbar } from 'react-bootstrap'

export default class AddMarkerInfo extends React.Component {
    static displayName = AddMarkerInfo.name;

    constructor(props){
        super(props);

        this.state = {
            shown: false,
            title: this.props.info.title,
            description: this.props.info.description,
            categories: this.props.info.categories,
            imageUrl: this.props.info.imageUrl,
            userId: this.props.userId
        };

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
        let info = {
            title: this.state.title,
            description:this.state.description,
            categories:this.state.categories,
            imageUrl:this.state.imageUrl,
        }
        let options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        };
        fetch(`/api/mark/${this.props.markerId}`, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.statusCode){

            } else {
                this.props.setInfo(info, this.hideModal);
            }
        })
    }

    onChange(e){
        switch(e.target.name){
            case "title":
                this.setState({title: e.target.value});
                break;
            case "description":
                this.setState({description: e.target.value});
                break;
            case "categories":
                this.setState({categories: e.target.value});
                break;
            case "imageUrl":
                this.setState({imageUrl: e.target.value});
                break;
            default:
                break;
        }
    }

    render(){
        return (
            <Fragment>
                <Button style={{display: this.props.display}} onClick={this.showModal}>Modify info</Button>
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
                                <input type="text" className="form-control" name="categories" placeholder="Pups" value={this.state.categories} onChange={this.onChange} required />
                                <small id="emailHelp" className="form-text text-muted">Enter category</small>
                            </div>
                            <div className="col">
                                <label htmlFor="inputNumber">Image url</label>
                                <input type="text" className="form-control" name="imageUrl" placeholder="Pups" value={this.state.imageUrl} onChange={this.onChange} required />
                                <small id="emailHelp" className="form-text text-muted">Enter image url</small>
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