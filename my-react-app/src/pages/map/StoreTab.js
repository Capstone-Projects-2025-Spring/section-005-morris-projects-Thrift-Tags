import React, {useEffect, useState} from "react";
import {db} from "../../firebase";
import {collection, doc, getDoc, getDocs} from 'firebase/firestore';
import {APIProvider, Map, AdvancedMarker, Pin, InfoWindow, MapCameraChangedEvent} from "@vis.gl/react-google-maps";
import axios from "axios";
import "./StoreTab.css";

export default function StoreTab() {

    const [isStoreTabOpen, setIsStoreTabOpen] = useState(false);
    const [stores, setStores] = useState([]);

    const toggleStoreTab = () => {
        setIsStoreTabOpen(!isStoreTabOpen);
    };

    const fetchStores = async () => {
        try {
            const storesCollection = collection(db, "stores"); // Access the 'stores' collection
            const storeSnapshot = await getDocs(storesCollection);
            const storeList = storeSnapshot.docs.map(doc => ({
                id: doc.id, // Document ID
                ...doc.data() // Data from Firestore
            }));
            setStores(storeList); // Store the stores in state
        } catch (error) {
            console.error("Error fetching stores: ", error);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    return (
        <div className={`store-tab-container ${isStoreTabOpen ? 'open' : ''}`}>
            {/* Toggle button attached to the edge */}
            <button className="store-tab-toggle-button" onClick={toggleStoreTab}>
                {isStoreTabOpen ? '❮' : '❯'}
            </button>

            <div className="store-header">
                <h3>Stores</h3>
            </div>
            <div className="store-content">
                {stores.length > 0 ? (
                    stores.map((store) => (
                        <div key={store.id} className="individual-store">
                            <h4>{store["Business Name"]}</h4>
                            <p><strong>Category:</strong> {store["Category"]}</p>
                            <p><strong>Rating:</strong> {store["Rating"]}</p>
                            <p><strong>Address:</strong> {store["Address"]}</p>
                            {store["Phone"] && <p><strong>Phone:</strong> {store["Phone"]}</p>}
                            {store["Email"] && <p><strong>Email:</strong> {store["Email"]}</p>}
                            {store["Reviews"] && <p><strong>Reviews:</strong> {store["Reviews"]}</p>}
                        </div>
                    ))
                ) : (
                    <div>No stores available.</div>
                )}
            </div>
        </div>
    );


}