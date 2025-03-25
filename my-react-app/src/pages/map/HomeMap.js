import React from "react";
import "./HomeMap.css";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, MapCameraChangedEvent } from "@vis.gl/react-google-maps";

export default function HomeMap() {
    const position = { lat: 39.9526, lng: -75.1652 };

    return (
        <div className="home-map-container">
            <nav className="navbar">
                <div className="nav-links">
                    <a href="#">Home</a>
                </div>
                <h1 className="logo">Thrift Tags</h1>
                <div className="nav-links">
                    <div className="menu-icon">☰</div>
                </div>
            </nav>

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
                        <Map zoom={9} center={position} className="google-map" />
                    </APIProvider>
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