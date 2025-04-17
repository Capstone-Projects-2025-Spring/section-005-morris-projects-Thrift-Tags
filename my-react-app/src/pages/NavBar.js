import React, {useState} from 'react';
import {Link, useMatch, useResolvedPath} from "react-router-dom"
import './NavBar.css';

export default function NavBar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="nav">
            <div className="title-block">
                <Link to="/home" className="site-title">
                    ThriftTags
                </Link>
            </div>
            <div className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}></div>
                <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}></div>
                <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}></div>
            </div>
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <CustomLink to="/events">Events</CustomLink>
                <CustomLink to="/friends">Friends</CustomLink>
                <CustomLink to="/profile">Profile</CustomLink>
            </ul>
        </nav>
    )
}

function CustomLink({to, children, ...props}){
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({path: resolvedPath.pathname, end:true})
    return(
        <li className={isActive ? "active" : ""}>
            <Link to={to}{...props}>
                {children}
            </Link>
        </li>
    )
}
