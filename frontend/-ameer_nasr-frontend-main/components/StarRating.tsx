import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  showReviews?: boolean;
  reviewCount?: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = false,
  showReviews = false,
  reviewCount = 0,
  editable = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  const renderStar = (index: number) => {
    const diff = rating - index;

    if (diff >= 1) {
      return <FaStar key={index} className="text-yellow-500" />;
    } else if (diff >= 0.75) {
      return <FaStar key={index} className="text-yellow-500" />;
    } else if (diff >= 0.5) {
      return <FaStarHalfAlt key={index} className="text-yellow-500" />;
    } else if (diff >= 0.25) {
      return <FaStarHalfAlt key={index} className="text-yellow-500" />;
    } else {
      return <FaRegStar key={index} className="text-gray-300" />;
    }
  };

  const handleClick = (index: number) => {
    if (editable && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex gap-1 ${sizeClasses[size]} ${
          editable ? "cursor-pointer" : ""
        }`}
      >
        {[...Array(maxRating)].map((_, i) => (
          <span key={i} onClick={() => handleClick(i)}>
            {renderStar(i)}
          </span>
        ))}
      </div>
      {showNumber && (
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)}/{maxRating}
        </span>
      )}
      {showReviews && reviewCount > 0 && (
        <span className="text-sm text-gray-600">
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
}
