import './App.css';
import LoginPage from "./pages/login/LoginPage";
import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./pages/NavBar";
import HomeMap from "./pages/map/HomeMap";
import EventsPage from "./pages/EventsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return(
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/home" element={<HomeMap/>}/>
                <Route path="/events" element={<EventsPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
