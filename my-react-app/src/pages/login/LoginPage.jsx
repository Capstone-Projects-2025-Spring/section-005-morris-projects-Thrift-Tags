import { useState, useEffect } from "react";
import "./LoginPage.css";
import emailIcon from "../../images/email.png";
import passwordIcon from "../../images/password.png";
import userIcon from "../../images/person.png";
import bg1 from "../../images/valuevillage.jpg";
import bg2 from "../../images/salvationarmy.jpeg";
import bg3 from "../../images/Goodwill.jpg.webp";
import bg4 from "../../images/communityaid.jpeg";
import bg5 from "../../images/buffaloexchange.jpeg";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { gapi } from 'gapi-script';
import {Link, useMatch, useResolvedPath} from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import LoginButton from './Login';

const clientId = "91424131370-ievd7huontv62lvh8g7r0nnsktp4mheh.apps.googleusercontent.com";

const LoginPage = ({onLogin}) => {
  const [action, setAction] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (action === "Sign Up") {
      try {
        await setDoc(doc(db, "users", email), {
          username,
          email,
          password,
          createdAt: new Date().toISOString(),
        });
        alert("Sign up successful!");
        setAction("Login");
        setUsername("");
        setEmail("");
        setPassword("");
      } catch (err) {
        console.error("Error signing up:", err);
        alert("Sign up failed.");
      }
    } else {
      try {
        const userDoc = await getDoc(doc(db, "users", email));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.password === password) {
            alert("Login successful!");
            sessionStorage.setItem('userEmail', email);
            navigate("/home");
          } else {
            alert("Incorrect password.");
          }
        } else {
          alert("User not found.");
        }
      } catch (err) {
        console.error("Error logging in:", err);
        alert("Login failed.");
      }
    }
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "profile email",
      }).then(() => {
        const auth2 = gapi.auth2.getAuthInstance();
        if (auth2) {
          auth2.isSignedIn.listen(handleAuthChange);
        } else {
          console.error("Google Auth2 instance is not initialized properly.");
        }
      }).catch((error) => {
        console.error("Error initializing Google client", error);
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const handleLogin = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn({ prompt: 'select_account' })  // 'select_account' will trigger the popup
        .then(() => {
          const googleUser = auth2.currentUser.get();
          const id_token = googleUser.getAuthResponse().id_token;
          authenticate(id_token);
        });
  };

  const authenticate = async (id_token) => {
    try {
      const response = await fetch('/auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${id_token}`,
        },
      });
      if (response.ok) {
        sessionStorage.setItem('id_token', id_token);
        onLogin();
        navigate('/home');
      }
    } catch (error) {
      console.error("Authentication error", error);
    }
  };

  const handleAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      const auth2 = gapi.auth2.getAuthInstance();
      const googleUser = auth2.currentUser.get();
      const id_token = googleUser.getAuthResponse().id_token;
      authenticate(id_token);
    }
  };


  return (
      <div className="login-page">
        <div className="background">
          <div className="slide" style={{backgroundImage: `url(${bg1})`}}></div>
          <div className="slide" style={{backgroundImage: `url(${bg2})`}}></div>
          <div className="slide" style={{backgroundImage: `url(${bg3})`}}></div>
          <div className="slide" style={{backgroundImage: `url(${bg4})`}}></div>
          <div className="slide" style={{backgroundImage: `url(${bg5})`}}></div>
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

          <form className="container-login" onSubmit={handleSubmit}>
            <div className="header">
              <div className="text">{action}</div>
              <div className="underline"></div>
            </div>

            <div className="inputs">
              {action === "Sign Up" && (
                  <div className="input">
                    <img src={userIcon} alt="Username"/>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                  </div>
              )}
              <div className="input">
                <img src={emailIcon} alt="Email"/>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="input">
                <img src={passwordIcon} alt="Password"/>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
            </div>

            {action === "Login" && (
                <div className="forgot-password">
                  Lost password? <span>Click here!</span>
                </div>
            )}

            {/* Google Login Button */}
            <div className="google-login">
              <LoginButton onClick={handleLogin}>Login with Google</LoginButton>
            </div>

            <div className="demo-button">
              <button onClick={() => navigate('/home')}>Go to Home</button>
            </div>

            <div className="submit-container">
              <button
                  type="button"
                  className={action === "Login" ? "submit gray" : "submit"}
                  onClick={() => setAction("Sign Up")}
              >
                Sign Up
              </button>
              <button
                  type="submit"
                  className={action === "Sign Up" ? "submit gray" : "submit"}
              >
                {action}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginPage;
