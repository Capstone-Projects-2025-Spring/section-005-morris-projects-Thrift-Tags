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
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import LoginButton from './Login';
import { useAuth } from '../../context/AuthContext';

const clientId = "91424131370-ievd7huontv62lvh8g7r0nnsktp4mheh.apps.googleusercontent.com";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signup, login, error: authError } = useAuth();
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (action === "Sign Up") {
        const userCredential = await signup(email, password);
        
        await setDoc(doc(db, "users", email), {
          username,
          email,
          createdAt: new Date().toISOString(),
        });

        await setDoc(doc(db, "users", userCredential.user.uid), {
          username,
          email,
          createdAt: new Date().toISOString(),
          authId: userCredential.user.uid
        });

        alert("Sign up successful!");
        navigate("/home");
      } else {
        try {
          await login(email, password);

          const userDoc = await getDoc(doc(db, "users", email));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            localStorage.setItem('userData', JSON.stringify(userData));
            
            alert("Login successful!");
            navigate("/home");
          } else {
            setError("User data not found in database.");
          }
        } catch (err) {
          console.error("Login error:", err);
          if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            setError("Invalid email or password.");
          } else {
            setError(err.message);
          }
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        default:
          setError(err.message);
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

        <div className="container-login">
          <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
          </div>

          <form onSubmit={handleSubmit}>
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
              {error && (
                <div className="error-message" style={{color: 'red', textAlign: 'center'}}>
                  {error}
                </div>
              )}
            </div>

            {action === "Login" && (
              <div className="forgot-password">
                Lost password? <span>Click here!</span>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button"
            >
              {action}
            </button>

            <div className="submit-container">
              <button
                type="button"
                className={action === "Login" ? "submit" : "submit gray"}
                onClick={() => setAction("Sign Up")}
              >
                Sign Up
              </button>
              <button
                type="button"
                className={action === "Sign Up" ? "submit" : "submit gray"}
                onClick={() => setAction("Login")}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
