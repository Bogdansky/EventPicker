import React, { Fragment } from 'react'
import {Popup} from 'react-leaflet'

export default class MarkerInfo extends React.Component {
    static displayName = MarkerInfo.name;

    constructor(props){
        super(props);

        this.state = {
            status: "add",
            shown: false,
            info: {
                title: "This is Jonny!",
                description: "no description",
                category: "no category",
                imageUrl: "https://bankoboev.ru/storage/thumbnail/bankoboev.ru-155581.jpg"
            }
        }

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setInfo = this.setInfo.bind(this);
    }

    setInfo(info, cb){
        console.log("Trying to set info");
        this.setState({info}, cb);
    }

    render(){
        return (
          <Popup>
                <h1>{this.state.info.title}</h1>
                <small>Category: {this.state.info.category}</small>
                <p>{this.state.info.description}</p>
                <img height='100px' width='200px' src={this.state.info.imageUrl}></img>
                <AddMarkerInfo setInfo={this.setInfo}/>
          </Popup>  
        );
    }
}