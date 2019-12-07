import React from 'react'
import { Map as LeafletMap, TileLayer, Marker } from 'react-leaflet';
import {FormControl, InputGroup, Button} from 'react-bootstrap'
import './Map.css'
import MarkerInfo from './marker/MarkerInfo';

export class Maps extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            ownLocation: [53.9000832,27.5349504],
            zoom: 6,
            markers:[],
            customLat: undefined,
            customLng: undefined
        }

        this.getGeoLocation = this.getGeoLocation.bind(this);
        this.addMarker = this.addMarker.bind(this);
        this.deleteMarker = this.deleteMarker.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.coordsInput = this.coordsInput.bind(this);
        this.pickMarker = this.pickMarker.bind(this);
        this.afterInput = this.afterInput.bind(this);

        try {
            fetch('api/mark/')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data && data.length){
                        this.setState({markers: data})
                    }
                })
                .catch(e =>{ console.error(e) })
        }
        catch(e){
            console.error(e);
        }
    }

    getGeoLocation() {
        console.log("get geolocation")
        navigator.geolocation.getCurrentPosition((x) => {
            this.state.ownLocation = [x.coords.latitude, x.coords.longitude];
        });
    }

    addMarker(e){
        let userId = localStorage.getItem("userId");
        let options = this.getOptions(e);
        fetch("/api/mark/" + userId, options)
        .then(response => response.json())
        .then(data => {
            if (data.statusCode){
                // TODO handle error
            } else {
                let markers = this.state.markers;
                let newMarker = {
                    id: data.id,
                    coordinates: {
                        latitude: e.latlng.lat,
                        longitude: e.latlng.lng
                    },
                    userId: data.userId
                }
                markers.push(newMarker);
                this.setState({markers});
            }
        })
    }

    deleteMarker(e){
        let markers = this.state.markers;

        let marker = markers.find(m => m.coordinates.latitude == e.latlng.lat && m.coordinates.longitude == e.latlng.lng);
        let userId = localStorage.getItem("userId");
        
        if (marker && marker.userId == userId){
            let options = this.getOptions(e);
            options.method = "DELETE";
            fetch(`/api/mark/${marker.id}/user/${userId}`, options)
            .then(response => response.json())
            .then(data => {
                if (data.statusCode){
                    // TODO handle error
                } else {
                    markers.splice(markers.indexOf(marker), 1);
                    this.setState({markers});
                }
            })
            .catch(error => {console.log(error)})
        }
    }
    
    getOptions(e){
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "Latitude": e.latlng.lat,
                "Longitude": e.latlng.lng
            })
        };
    }

    coordsInput(e){
        if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 190 && e.keyCode != 8){
            e.preventDefault();
        }
    }

    afterInput(e){
        switch(e.target.name){
                case "lat":
                    this.setState({customLat: e.target.value});
                case "lng":
                    this.setState({customLng: e.target.value});
                default: break;
            }
    }

    pickMarker(e){
        e.preventDefault();
        if (this.state.customLat > 90 || this.state.customLat < -90){
            alert("Incorrect latitude");
        } else if (this.state.customLat > 180 || this.state.customLat < -180){
            alert("Incorrect longitude");
        } else {
            let latitude = parseFloat(this.state.customLat);
            let longitude = parseFloat(this.state.customLng);
            if (!(latitude && longitude)){
                return;
            }
            debugger
            this.setState({ownLocation: [latitude, longitude], zoom: 10})
        }
    }

    render() {
        if (!this.state.ownLocation){
            this.getGeoLocation();
        }
        return (
            <React.Fragment>
                <LeafletMap
                center={this.state.ownLocation}
                zoom={this.state.zoom}
                maxZoom={18}
                attributionControl={true}
                zoomControl={true}
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
                        <Marker key={`marker_${marker.id}`} position={[marker.coordinates.latitude, marker.coordinates.longitude]} oncontextmenu={this.deleteMarker}>
                            <MarkerInfo markerId={marker.id} title={marker.title} description={marker.description}
                            imageUrl={marker.imageUrl} categories={marker.categories} userId={marker.userId}/>
                        </Marker>
                    )}
                </LeafletMap>
                <div>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Latitude</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl placeholder="Latitude" name="lat" onKeyDown={this.coordsInput} onChange={this.afterInput} />
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Longitude</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl placeholder="Longitude" name="lng" onKeyDown={this.coordsInput} onChange={this.afterInput} />
                    </InputGroup>
                    <Button onClick={this.pickMarker}>View marker</Button>
                </div>
            </React.Fragment>
        );
    }
}
