import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

function StarRating({ rating = 0 }) {
  return (
    <div className="d-flex justify-content-start">
      {[...Array(5)].map((_, i) => (
        <FaStar className="me-1" key={i} size={18} color={i < rating ? '#ffc107' : '#e4e5e9'} />
      ))}
    </div>
  );
}

// === 新增 `propTypes` 驗證 ===
StarRating.propTypes = {
  rating: PropTypes.number.isRequired, // 確保 `rating` 是數字
};

export default StarRating;
