import './App.css';
import LoginPage from "./pages/login/LoginPage";
import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeMap from "./pages/map/HomeMap";
import EventsPage from "./pages/EventsPage";
import ProfilePage from "./pages/ProfilePage";

import FriendPage from './pages/FriendPage';

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return(
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
                    {isLoggedIn && (
                        <>
                            <Route path="/home" element={<HomeMap/>}/>
                            <Route path="/events" element={<EventsPage/>}/>
                            <Route path="/recommendations" element={<ProfilePage/>}/>
                        
                        </>
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
