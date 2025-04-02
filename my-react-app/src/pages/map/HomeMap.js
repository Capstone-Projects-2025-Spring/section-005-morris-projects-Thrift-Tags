import React, {useEffect, useState} from "react";
import "./HomeMap.css";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import axios from "axios";
import NavBar from "../NavBar";

export default function HomeMap() {
    const [userPosition, setUserPosition] = useState({ lat: 48.86, lng: 2.35});
    const [mapLoaded, setMapLoaded] = useState(false);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserPosition(userPos);
                },
                () => {
                    alert("Unable to retrieve your location.");
                    setUserPosition({ lat: 48.8566, lng: 2.3522 });
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setUserPosition({ lat: 48.8566, lng: 2.3522 });
        }
    };

    useEffect(() => {
        getUserLocation();
    }, []);

    return (
        <div className="home-map-container">

            <div className="city-title">
                <h2>Philadelphia</h2>
                <p>PA</p>
            </div>

            <div className="content-container">
                <div className="location-info">
                    <h3>Location 1 Example</h3>
                    <p>413 N 4th St Philadelphia, PA 19123</p>
                    <p>The Wardrobe</p>
                    <div className="location-image">
                        <span className="image-placeholder"></span>
                    </div>
                </div>

                <div className="map-container">
                    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                        <Map zoom={12} center={userPosition} className="google-map"
                             mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID} onLoad={() => setMapLoaded(true)}>
                            <AdvancedMarker
                                position={userPosition}
                                title="Your Location"
                            />
                            <AdvancedMarker
                                position={{ lat: 39.9612, lng: -75.1551 }}
                                title="The Wardrobe"
                            />
                            <AdvancedMarker
                                position={{ lat: 39.9385, lng: -75.1492 }}
                                title="Philly AIDS Thrift"
                            />
                            <AdvancedMarker
                                position={{ lat: 39.9500, lng: -75.1700 }}
                                title="Urban Exchange Project"
                            />
                            <AdvancedMarker
                                position={{ lat: 39.9498, lng: -75.1673 }}
                                title="Greene Street Consignment"
                            />
                            <AdvancedMarker
                                position={{ lat: 39.9498, lng: -75.1673 }}
                                title="Greene Street Consignment"
                            />
                            <AdvancedMarker
                                position={{ lat: 39.9475, lng: -75.1622 }}
                                title="Buffalo Exchange"
                            />
                            <AdvancedMarker
                                position={{ lat: 39.9391, lng: -75.1523 }}
                                title="Retrospect Vintage"
                            />
                            <InfoWindow position={userPosition}>
                                <div>Your Current Location</div>
                            </InfoWindow>
                        </Map>
                    </APIProvider>
                    {mapLoaded && (
                        <button
                            className="current-location-btn" onClick={getUserLocation}>
                            Pan to Current Location
                        </button>
                    )}
                </div>

                <div className="reviews-section">
                    <h3>Reviews</h3>
                    <ul>
                        <li><span>1:</span> Review Example...</li>
                        <li><span>2:</span> Review Example...</li>
                        <li><span>3:</span> Review Example...</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}