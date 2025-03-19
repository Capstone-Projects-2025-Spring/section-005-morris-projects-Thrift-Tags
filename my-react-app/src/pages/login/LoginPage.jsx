import {useEffect, useState} from "react";
import './LoginPage.css'
import emailIcon from "../../images/email.png";
import passwordIcon from "../../images/password.png";
import userIcon from "../../images/person.png";
import LoginButton from "./Login";
import {gapi} from "gapi-script";
import {Link, useMatch, useResolvedPath} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import Login from "./Login";

const clientId = "91424131370-ievd7huontv62lvh8g7r0nnsktp4mheh.apps.googleusercontent.com";

const LoginPage = ({onLogin}) => {
    const navigate = useNavigate();
    const [action, setAction] = useState("Login");

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: ""
            }).then(() => {
                const auth2 = gapi.auth2.getAuthInstance();
                auth2.isSignedIn.listen(handleAuthChange);
            });
        }
        gapi.load('client:auth2', start);
    }, []);

    const handleLogin = () => {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signIn().then(() => {
            const googleUser = auth2.currentUser.get();
            const id_token = googleUser.getAuthResponse().id_token;
            authenticate(id_token);
        });
    };

    const authenticate = async (id_token) => {
        try{
            const response = await fetch('/auth', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${id_token}`
                }
            });
            if(response.ok){
                sessionStorage.setItem('id_token', id_token);
                onLogin();
                navigate('/home');
            }
        }
        catch (error){
            console.error("Authentication error", error);
        }
    }

    const handleAuthChange = (isSignedIn) => {
        if(isSignedIn){
            const auth2 = gapi.auth2.getAuthInstance();
            const googleUser = auth2.currentUser.get();
            const id_token = googleUser.getAuthResponse().id_token;
            authenticate(id_token);
        }
    }



    return(
        <body className="body-login">
            <div className="left-side">
                <h1>ThriftTags</h1>
                <p>Welcome to ThriftTags! ThriftTags aims to connect our thrifting community to
                share locations they frequent, from common to unique finds! We encourage users to share
                their finds with others and make new connections.</p>
            </div>
            <div className="container-login">
                <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    {action === "Login" ? <div></div>
                        :
                        <div className="input">
                            <img src={userIcon} alt=""/>
                            <input type="text" placeholder="Username"/>
                        </div>
                    }
                    <div className="input">
                        <img src={emailIcon} alt=""/>
                        <input type="email" placeholder="Email"/>
                    </div>
                    <div className="input">
                        <img src={passwordIcon} alt=""/>
                        <input type="password" placeholder="Password"/>
                    </div>
                    <div className="google-login" onClick={handleLogin}>
                        <LoginButton/>
                    </div>
                </div>

                {action === "Sign Up" ? <div></div>
                    : <div className="forgot-password">Lost password? <span>Click here!</span></div>
                }
                <div className="submit-container">
                    <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => {
                        setAction("Sign Up")
                    }}>Sign Up
                    </div>
                    <div className={action === "Sign Up" ? "submit gray:" : "submit"} onClick={() => {
                        setAction("Login")
                    }}>Login
                    </div>
                </div>
            </div>
        </body>
    )
}

export default LoginPage;