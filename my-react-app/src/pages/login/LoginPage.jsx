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
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import HomeMap from "../map/HomeMap";

const LoginPage = () => {
  const [action, setAction] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailLower = email.toLowerCase();

    if (action === "Sign Up") {
      try {
        await setDoc(doc(db, "users", emailLower), {
          username,
          email: emailLower,
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
        const userDoc = await getDoc(doc(db, "users", emailLower));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.password === password) {
            alert("Login successful!");
            navigate(HomeMap);
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

        <form className="container-login" onSubmit={handleSubmit}>
          <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
          </div>

          <div className="inputs">
            {action === "Sign Up" && (
              <div className="input">
                <img src={userIcon} alt="" />
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
              <img src={emailIcon} alt="" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input">
              <img src={passwordIcon} alt="" />
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
