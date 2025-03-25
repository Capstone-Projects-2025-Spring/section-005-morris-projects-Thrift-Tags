import { useState } from "react";
import "./LoginPage.css";
import emailIcon from "../../images/email.png";
import passwordIcon from "../../images/password.png";
import userIcon from "../../images/person.png";
import bg1 from "../../images/valuevillage.jpg";
import bg2 from "../../images/salvationarmy.jpeg";
import bg3 from "../../images/Goodwill.jpg.webp";
import bg4 from "../../images/communityaid.jpeg";
import bg5 from "../../images/buffaloexchange.jpeg";

const LoginPage = ({ onLogin }) => {
    const [action, setAction] = useState("Login");

    return (
        <div className="login-page">
            <div className="background">
                <div className="slide" style={{ backgroundImage: `url(${bg1})` }}></div>
                <div className="slide" style={{ backgroundImage: `url(${bg2})` }}></div>
                <div className="slide" style={{ backgroundImage: `url(${bg3})` }}></div>
                <div className="slide" style={{ backgroundImage: `url(${bg4})` }}></div>
                <div className="slide" style={{ backgroundImage: `url(${bg5})` }}></div>
            </div>

            <div className="body-login">
                <div className="left-side">
                    <h1>ThriftTags</h1>
                    <p>
                        Welcome to ThriftTags! ThriftTags aims to connect our thrifting
                        community to share locations they frequent, from common to unique
                        finds! We encourage users to share their finds with others and
                        make new connections.
                    </p>
                </div>
                <div className="container-login">
                    <div className="header">
                        <div className="text"></div>
                        <div className="underline"></div>
                    </div>
                    <div className="inputs">
                        <div className="input">
                            <img src={userIcon} alt="" />
                            <input type="text" placeholder="Username" />
                        </div>
                        <div className="input">
                            <img src={emailIcon} alt="" />
                            <input type="email" placeholder="Email" />
                        </div>
                        <div className="input">
                            <img src={passwordIcon} alt="" />
                            <input type="password" placeholder="Password" />
                        </div>
                    </div>
                    {action === "Sign Up" ? (
                        <div></div>
                    ) : (
                        <div className="forgot-password">
                            Lost password? <span>Click here!</span>
                        </div>
                    )}
                    <div className="submit-container">
                        <div
                            className={action === "Login" ? "submit gray" : "submit"}
                            onClick={() => setAction("Sign Up")}
                        >
                            Sign Up
                        </div>
                        <div
                            className={action === "Sign Up" ? "submit gray" : "submit"}
                            onClick={() => setAction("Login")}
                        >
                            Login
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;