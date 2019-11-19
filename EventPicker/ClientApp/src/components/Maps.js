import React from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';

export class Maps extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ownLocation: [0,0]
        }

        this.getGeoLocation = this.getGeoLocation.bind(this);
    }

    getGeoLocation() {
        navigator.geolocation.getCurrentPosition((x) => {
            this.state.ownLocation = [x.coords.latitude, x.coords.longitude];
        });
    }

    render() {
        this.getGeoLocation();
        return (
            <LeafletMap
                center={[50, 10]}
                zoom={6}
                maxZoom={10}
                attributionControl={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
            >
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                <Marker position={[50, 10]}>
                    <Popup>
                        Popup for any custom information.
                    </Popup>
                </Marker>
                <Marker position={this.state.ownLocation}>
                    <Popup>
                        Popup for any custom information.
                    </Popup>
                </Marker>
            </LeafletMap>
        );
    }
}
