import PropTypes from 'prop-types';
import '../styles/components/ReviewCard.css';

const ReviewCard = ({ review }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
                ★
            </span>
        ));
    };

    return (
        <div className="review-card">
            <div className="review-header">
                <div className="reviewer-info">
                    <img
                        src={review.patientId?.profileImage || '/default-avatar.png'}
                        alt={review.patientId?.name}
                        className="reviewer-avatar"
                    />
                    <div>
                        <h4>{review.patientId?.name || 'Anonymous'}</h4>
                        <p className="review-date">{formatDate(review.createdAt)}</p>
                    </div>
                </div>
                <div className="review-rating">{renderStars(review.rating)}</div>
            </div>

            {review.comment && (
                <div className="review-comment">
                    <p>{review.comment}</p>
                </div>
            )}
        </div>
    );
};

ReviewCard.propTypes = {
    review: PropTypes.shape({
        patientId: PropTypes.shape({
            name: PropTypes.string,
            profileImage: PropTypes.string,
        }),
        rating: PropTypes.number.isRequired,
        comment: PropTypes.string,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default ReviewCard;
