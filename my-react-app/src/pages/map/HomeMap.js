import React, {useEffect, useState} from "react";
import "./HomeMap.css";
import {db} from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import axios from "axios";
import NavBar from "../NavBar";
import StoreTab from "./StoreTab";

export default function HomeMap() {
    const [userPosition, setUserPosition] = useState({ lat: 39.9526, lng: -75.1652});
    const [mapLoaded, setMapLoaded] = useState(false);
    const [activeStoreId, setActiveStoreId] = useState(null);
    const [stores, setStores] = useState([]);

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
                    setUserPosition({ lat: 39.9526, lng: -75.1652});
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setUserPosition({ lat: 39.9526, lng: -75.1652});
        }
    };

    const fetchStores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stores"));
        const storeData = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          const rawLat = data.Latitude?.trim?.();
          const rawLng = data.Longitude?.trim?.();
          const lat = parseFloat(rawLat);
          const lng = parseFloat(rawLng);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn("Skipping store with invalid coordinates:", data);
            return null;
          }

          return {
            id: doc.id,
            ...data,
            lat,
            lng,
          };
        });

        const validStores = storeData.filter(Boolean);
        console.log("Valid stores:", validStores);
        setStores(validStores);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    useEffect(() => {
        getUserLocation();
        fetchStores();
    }, []);

    const handleMarkerClick = (storeId) => {
      setActiveStoreId(storeId);
      const element = document.getElementById(`store-${storeId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    return (
        <div className="home-map-container">
            <div className="city-title">
                <h2>Philadelphia</h2>
                <p>PA</p>
            </div>

            <div className="content-container">
                <StoreTab/>

                <div className="map-container">
                    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                        <Map zoom={12} defaultCenter={userPosition} className="google-map"
                             mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID} onLoad={() => setMapLoaded(true)}>
                            <AdvancedMarker
                                position={userPosition}
                                title="Your Location">
                              <Pin background="#3366cc" borderColor="#003399" glyphColor="white" />
                            </AdvancedMarker>
                            {stores.map((store) => (
                                <AdvancedMarker
                                    key={store.id}
                                    position={{ lat: store.lat, lng: store.lng }}
                                    title={store["Business Name"]}
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
                                            position={{ lat: store.lat, lng: store.lng }}
                                            onCloseClick={() => setActiveStoreId(null)}
                                        >
                                            <div>{store["Business Name"]}</div>
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
            </div>
        </div>
    );
}