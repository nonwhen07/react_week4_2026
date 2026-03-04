import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

function StarRating({ rating = 0 }) {
  const safeRating = Math.max(0, Math.min(5, rating));
  return (
    <div className="d-flex">
      {[...Array(5)].map((_, i) => (
        <FaStar key={i} size={18} className="me-1" color={i < safeRating ? '#ffc107' : '#e4e5e9'} />
      ))}
    </div>
  );
}

// === 新增 `propTypes` 驗證 ===
StarRating.propTypes = {
  rating: PropTypes.number,
};

export default StarRating;
