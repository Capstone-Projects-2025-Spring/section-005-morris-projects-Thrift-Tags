import React, { useEffect, useState } from 'react';
import './FriendPage.css';
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, where, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const FriendPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const email = sessionStorage.getItem('userEmail');
        setUserEmail(email);
        if (email) {
            fetchFriendData(email);
        }
    }, []);

    const fetchFriendData = async (email) => {
        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            setFriendRequests(data.friendRequests || []);
            setFriends(data.friends || []);
        }
    };

    const handleSearch = async () => {
        const q = query(collection(db, "users"), where("username", "==", searchTerm));
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((docSnap) => {
            if (docSnap.id !== userEmail) {
                results.push({ email: docSnap.id, ...docSnap.data() });
            }
        });
        setSearchResults(results);
    };

    const sendFriendRequest = async (toEmail) => {
        const toRef = doc(db, "users", toEmail);
        await updateDoc(toRef, {
            friendRequests: arrayUnion(userEmail)
        });
        alert("Friend request sent!");
    };

    const acceptRequest = async (fromEmail) => {
        const myRef = doc(db, "users", userEmail);
        const fromRef = doc(db, "users", fromEmail);

        await updateDoc(myRef, {
            friends: arrayUnion(fromEmail),
            friendRequests: arrayRemove(fromEmail)
        });
        await updateDoc(fromRef, {
            friends: arrayUnion(userEmail)
        });

        setFriendRequests(friendRequests.filter(email => email !== fromEmail));
        setFriends([...friends, fromEmail]);
    };

    const rejectRequest = async (fromEmail) => {
        const myRef = doc(db, "users", userEmail);
        await updateDoc(myRef, {
            friendRequests: arrayRemove(fromEmail)
        });
        setFriendRequests(friendRequests.filter(email => email !== fromEmail));
    };

    const removeFriend = async (emailToRemove) => {
        const myRef = doc(db, "users", userEmail);
        const friendRef = doc(db, "users", emailToRemove);

        await updateDoc(myRef, {
            friends: arrayRemove(emailToRemove)
        });
        await updateDoc(friendRef, {
            friends: arrayRemove(userEmail)
        });

        setFriends(friends.filter(email => email !== emailToRemove));
    };

    const goToFriendProfile = (email) => {
        navigate(`/profile/${email}`);
    };

    return (
        <div className="friend-page">
            <h2>Friend Page</h2>

            <div className="search-section">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by username"
                />
                <button onClick={handleSearch}>Search</button>

                {searchResults.map((user, idx) => (
                    <div key={idx} className="search-result">
                        <span>{user.username} ({user.email})</span>
                        <button onClick={() => sendFriendRequest(user.email)}>Add Friend</button>
                    </div>
                ))}
            </div>

            <div className="requests-section">
                <h3>Friend Requests</h3>
                {friendRequests.length === 0 ? <p>No requests</p> : friendRequests.map((email, idx) => (
                    <div key={idx} className="request-item">
                        <span>{email}</span>
                        <button onClick={() => acceptRequest(email)}>Accept</button>
                        <button onClick={() => rejectRequest(email)}>Reject</button>
                    </div>
                ))}
            </div>

            <div className="friends-section">
                <h3>Your Friends</h3>
                {friends.length === 0 ? <p>You have no friends yet</p> : friends.map((email, idx) => (
                    <div key={idx} className="friend-item">
                        <span>{email}</span>
                        <button onClick={() => goToFriendProfile(email)}>View Profile</button>
                        <button onClick={() => removeFriend(email)} className="remove-button">Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendPage;
