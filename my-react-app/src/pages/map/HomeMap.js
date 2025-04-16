import React, {useEffect, useState} from "react";
import "./HomeMap.css";
import {db} from "../../firebase";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import axios from "axios";
import NavBar from "../NavBar";
import StoreTab from "./StoreTab";

export default function HomeMap() {
    const [userPosition, setUserPosition] = useState({ lat: 48.86, lng: 2.35});
    const [mapLoaded, setMapLoaded] = useState(false);
    const [activeStoreId, setActiveStoreId] = useState(null);

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

    const stores = [
      {
        id: 1,
        name: "The Wardrobe",
        position: { lat: 39.9612, lng: -75.1551 },
      },
      {
        id: 2,
        name: "Philly AIDS Thrift",
        position: { lat: 39.9385, lng: -75.1492 },
      },
      {
        id: 3,
        name: "Urban Exchange Project",
        position: { lat: 39.95, lng: -75.17 },
      },
      {
        id: 4,
        name: "Greene Street Consignment",
        position: { lat: 39.9498, lng: -75.1673 },
      },
      {
        id: 5,
        name: "Buffalo Exchange",
        position: { lat: 39.9475, lng: -75.1622 },
      },
      {
        id: 6,
        name: "Retrospect Vintage",
        position: { lat: 39.9391, lng: -75.1523 },
      },
    ];

    return (
        <div className="home-map-container">
            <div className="city-title">
                <h2>Philadelphia</h2>
                <p>PA</p>
            </div>

            <div className="content-container">
                <StoreTab/>
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
                                title="Your Location">
                              <Pin background="#3366cc" borderColor="#003399" glyphColor="white" />
                            </AdvancedMarker>
                            {stores.map((store) => (
                                <AdvancedMarker
                                    key={store.id}
                                    position={store.position}
                                    title={store.name}
                                    onClick={() =>
                                        setActiveStoreId((prev) => (prev === store.id ? null : store.id))
                                    }
                                >
                                    <Pin />
                                </AdvancedMarker>
                            ))}
                            {stores.map(
                                (store) =>
                                    activeStoreId === store.id && (
                                        <InfoWindow
                                            key={`info-${store.id}`}
                                            position={store.position}
                                            onCloseClick={() => setActiveStoreId(null)}
                                        >
                                            <div>{store.name}</div>
                                        </InfoWindow>
                                    )
                                )}
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