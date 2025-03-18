import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    // Sample user data - in a real app, this would come from your backend
    const [userData, setUserData] = useState({
        username: "John Doe",
        email: "john@example.com",
        joinDate: "March 2024",
        bio: "Thrifting enthusiast | Sustainable fashion lover",
        location: "San Francisco, CA",
        favorites: ["Vintage Clothing", "Antique Books", "Vinyl Records"],
        reviews: 5,
        friends: 15
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedBio, setEditedBio] = useState(userData.bio);

    const handleSaveProfile = () => {
        setUserData({ ...userData, bio: editedBio });
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {/* Default avatar circle with initials */}
                    <div className="avatar-circle">
                        {userData.username.charAt(0)}
                    </div>
                </div>
                <div className="profile-info">
                    <h1>{userData.username}</h1>
                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-number">{userData.reviews}</span>
                            <span className="stat-label">Reviews</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{userData.friends}</span>
                            <span className="stat-label">Friends</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-details">
                <div className="bio-section">
                    <p>{userData.bio}</p>
                    {isEditing ? (
                        <>
                            <textarea
                                value={editedBio}
                                onChange={(e) => setEditedBio(e.target.value)}
                                className="bio-edit"
                                placeholder="Edit your bio..."
                            />
                            <button onClick={handleSaveProfile} className="save-button">
                                Save
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="edit-button">
                            Edit Bio
                        </button>
                    )}
                </div>

                <div className="user-details">
                    <p><strong>Location:</strong> {userData.location}</p>
                    <p><strong>Member since:</strong> {userData.joinDate}</p>
                </div>

                <div className="favorites-section">
                    <h3>Favorite Categories</h3>
                    <div className="favorites-tags">
                        {userData.favorites.map((favorite, index) => (
                            <span key={index} className="favorite-tag">
                                {favorite}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;