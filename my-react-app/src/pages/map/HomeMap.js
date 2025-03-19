
import './HomeMap.css';
import {useState} from "react";
import {createRoot} from "react-dom/client";
import {APIProvider, Map, AdvancedMarker, Pin, InfoWindow, MapCameraChangedEvent} from '@vis.gl/react-google-maps';
// Initialize and add the map

export default function HomeMap(){
    const position = {lat: 39.9526, lng: -75.1652};
    console.log("API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    return(

        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <div style = {{height: "100vh"}}>
                <Map zoom={9} center={position}></Map>
            </div>
        </APIProvider>
    );
}
