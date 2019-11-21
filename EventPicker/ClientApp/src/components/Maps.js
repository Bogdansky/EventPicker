import React from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import './Map.css'
import AddMarkerInfo from './AddMarkerInfo'

export class Maps extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            ownLocation: [53.9000832,27.5349504],
            markers:[[50, 10], [53.9000832,27.5349504]]
        }

        this.getGeoLocation = this.getGeoLocation.bind(this);
        this.addMarker = this.addMarker.bind(this);
        this.deleteMarker = this.deleteMarker.bind(this);
    }

    getGeoLocation() {
        console.log("get geolocation")
        navigator.geolocation.getCurrentPosition((x) => {
            this.state.ownLocation = [x.coords.latitude, x.coords.longitude];
        });
    }

    addMarker(e){
        let markers = this.state.markers;
        markers.push(e.latlng);
        this.setState({markers});
    }

    deleteMarker(e){
        let markers = this.state.markers;
        let index = markers.indexOf(e.latlng);
        if (index > -1){
            markers.splice(index, 1);
            this.setState({markers});
        }
    }

    render() {
        if (!this.state.ownLocation){
            this.getGeoLocation();
        }
        return (
            <LeafletMap
                center={this.state.ownLocation}
                zoom={6}
                maxZoom={16}
                attributionControl={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
                onClick={this.addMarker}
            >
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                {this.state.markers.map(marker => 
                    <Marker position={marker} oncontextmenu={this.deleteMarker}>
                        <Popup>
                            <h1>This is Jonny!</h1>
                            <img height='100px' width='200px' src='http://www.imgworlds.com/wp-content/uploads/2015/12/18-CONTACTUS-HEADER.jpg'></img>
                            <AddMarkerInfo/>
                        </Popup>
                    </Marker>
                )}
            </LeafletMap>
        );
    }
}
