import React from 'react';
import './ReviewsPage.css';
import halfStar from '../images/Half_Star.png';
import emptyStar from '../images/gray star.png';

const ReviewsPage = () => {
    // Sample review data - in a real app, this would come from your backend
    const reviews = [
        {
            id: 1,
            store: "Second Chance Boutique",
            rating: 5,
            date: "January 15, 2025",
            content: "Amazing thrift store! Great selection of vintage clothing and very organized layout. The staff was super helpful and prices were reasonable.",
        },
        {
            id: 2,
            store: "Vintage Home Goods",
            rating: 4,
            date: "February 4, 2025",
            content: "Nice variety of second-hand furniture and home decor. The prices are a bit high, but the quality is good.",
        },
        {
            id: 3,
            store: "Goodwill",
            rating: 4.5,
            date: "Feburuary 8, 2025",
            content: "Nice variety of second-hand furniture and home decor. The prices are a bit high, but the quality is good.",
        },
        {
            id: 4,
            store: "Salvation Army",
            rating: 3.5,
            date: "March 10, 2025",
            content: "The selection was limited, but the prices were reasonable.",
        },
        {
            id: 5,
            store: "Thrift Store",
            rating: 2,
            date: "March 20, 2025",
            content: "The prices are a bit high, but the quality is good.",
        }
        // Add more sample reviews as needed
    ];

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

    return (
        <div className="reviews-container">
            <h1>Reviews</h1>
            <div className="reviews-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-content">
                            <h3 className="review-store">{review.store}</h3>
                            <div className="review-rating">{renderStars(review.rating)}</div>
                            <p className="review-text">{review.content}</p>
                            <div className="review-date">{review.date}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsPage; 