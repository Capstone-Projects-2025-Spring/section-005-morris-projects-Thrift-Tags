import React from 'react';
import {Link, useMatch, useResolvedPath} from "react-router-dom"
import './NavBar.css';

export default function NavBar() {
    return (
        <nav className="nav">
            <CustomLink to="/events">Events</CustomLink>
            <CustomLink to="/home" className="site-title">ThriftTags</CustomLink>
            <CustomLink to="/profile">Profile</CustomLink>
            {/* <CustomLink to="/friends">Friend</CustomLink> */}
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
