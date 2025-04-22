import './App.css';
import LoginPage from "./pages/login/LoginPage";
import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./pages/NavBar";
import HomeMap from "./pages/map/HomeMap";
import EventsPage from "./pages/EventsPage";
import ProfilePage from "./pages/ProfilePage";
import ReviewsPage from './pages/ReviewsPage';
import FriendPage from './pages/FriendPage';
import AddReviewPage from './pages/AddReviewPage';
import FriendProfilePage from './pages/FriendProfilePage';


function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return(
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/home" element={<HomeMap/>}/>
                <Route path="/events" element={<EventsPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/reviews" element={<ReviewsPage/>}/>
                <Route path="/friends" element={<FriendPage/>}/>
                <Route path="/add-review" element={<AddReviewPage/>}/>
                <Route path="/friendprofile" element={<FriendProfilePage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
export {HomeMap};