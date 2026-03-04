import PropTypes from 'prop-types';

function StarRating({ rating = 0 }) {
  return (
    <div className="d-flex justify-content-start">
      {[...Array(rating)].map((_, i) => (
        <span key={i}>⭐</span>
      ))}
      {/* {Array.from({ length: 5 }, (_, i) => (
        // 這裡的條件是 i < rating，當 i 小於 rating 時顯示實心星，否則顯示空心星
        <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
          ⭐
        </span>
      ))} */}
    </div>
  );
}

// === 新增 `propTypes` 驗證 ===
StarRating.propTypes = {
  rating: PropTypes.number.isRequired, // 確保 `rating` 是數字
};

export default StarRating;
