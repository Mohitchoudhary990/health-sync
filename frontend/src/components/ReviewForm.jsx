import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import '../styles/components/ReviewForm.css';

const ReviewForm = ({ appointmentId, doctorName, onSuccess, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setError('');
        setSubmitting(true);

        try {
            await api.post('/reviews', {
                appointmentId,
                rating,
                comment,
            });

            alert('Review submitted successfully!');
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="review-form-container">
            <h3>Write a Review for Dr. {doctorName}</h3>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                    <label>Rating</label>
                    <div className="star-rating">
                        {renderStars()}
                        <span className="rating-text">
                            {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Your Review (Optional)</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this doctor..."
                        rows="4"
                        maxLength="500"
                    />
                    <small>{comment.length}/500 characters</small>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

ReviewForm.propTypes = {
    appointmentId: PropTypes.string.isRequired,
    doctorName: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
};

export default ReviewForm;
