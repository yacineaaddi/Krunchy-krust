import PropTypes from "prop-types";

const containerStyle = {
  display: "flex",
  alignItem: "center",
  justifyContent: "center",
};

const starContainerStyle = {
  display: "flex",
  alignItem: "center",
  justifyContent: "center",
  gap: "3px",
};

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 18,
  className = "",
  defaultRating = 0,
  handleRating,
}) {
  const getStarType = (index) => {
    if (defaultRating >= index + 1) return "full";
    return "empty";
  };
  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            index={i}
            size={size}
            color={color}
            type={getStarType(i)}
            handleRating={handleRating}
          />
        ))}
      </div>
    </div>
  );
}

function Star({ type, color, size, handleRating, index }) {
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };
  return (
    <span style={starStyle} onClick={() => handleRating(index + 1)}>
      {type === "full" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 18"
          fill={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {type === "empty" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      )}
    </span>
  );
}

StarRating.propTypes = {
  maxRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
};
