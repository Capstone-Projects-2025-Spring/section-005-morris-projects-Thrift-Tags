import React, { useState, useEffect } from 'react';
import './ReviewsPage.css';
import halfStar from '../images/Half_Star.png';
import emptyStar from '../images/gray star.png';
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const email = sessionStorage.getItem('userEmail');
                if (!email) {
                    console.log("No user email found");
                    setLoading(false);
                    return;
                }

                const reviewsQuery = query(
                    collection(db, "reviews"),
                    where("userEmail", "==", email)
                );

                const querySnapshot = await getDocs(reviewsQuery);
                const fetchedReviews = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        return (
            <div className="stars-container">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="star">★</span>
                ))}
                {hasHalfStar && (
                    <img 
                        src={halfStar}
                        alt="half star" 
                        className="star half-star"
                    />
                )}
                {[...Array(5 - Math.ceil(rating))].map((_, i) => (
                    <img 
                        key={`empty-${i}`}
                        src={emptyStar}
                        alt="empty star"
                        className="star empty-star"
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return <div className="reviews-container">Loading...</div>;
    }

    return (
        <div className="reviews-container">
            <h1>Reviews</h1>
            {reviews.length === 0 ? (
                <p className="no-reviews">You haven't written any reviews yet.</p>
            ) : (
                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-content">
                                <h3 className="review-store">{review.storeName}</h3>
                                <div className="review-rating">{renderStars(review.rating)}</div>
                                <p className="review-text">{review.content}</p>
                                <div className="review-date">
                                    {new Date(review.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsPage; 