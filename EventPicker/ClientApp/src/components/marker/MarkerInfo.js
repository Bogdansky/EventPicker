import React, { Fragment } from 'react'
import {Popup} from 'react-leaflet'
import AddMarkerInfo from './AddMarkerInfo'

export default class MarkerInfo extends React.Component {
    static displayName = MarkerInfo.name;

    constructor(props){
        super(props);

        this.state = {
            shown: false,
            info: {
                title: this.props.title || "This is Jonny!",
                description: this.props.description || "no description",
                categories: this.props.categories || "",
                imageUrl: this.props.imageUrl || "https://bankoboev.ru/storage/thumbnail/bankoboev.ru-155581.jpg"
            }
        }

        this.setInfo = this.setInfo.bind(this);
    }

    setInfo(info, cb){
        this.setState({info}, cb);
    }

    render(){
        return (
          <Popup>
                <h1>{this.state.info.title}</h1>
                <small style={{display: this.state.info.categories ? "inherit" : "none"}}>Category: {this.state.info.categories}</small>
                <p>{this.state.info.description}</p>
                <img height='100px' width='200px' src={this.state.info.imageUrl}></img>
                <AddMarkerInfo display={this.props.userId == localStorage.getItem("userId") ? "inherit" : "none"} markerId={this.props.markerId} info={this.state.info} setInfo={this.setInfo}/>
          </Popup>  
        );
    }
}