import React from "react";
import { StarIcon } from "lucide-react";

interface StarsProps {
    rating: number;
    size?: number;
}

const Star: React.FC<StarsProps> = ({ rating, size = 16 }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
        <div
            className="flex items-center gap-0.5"
            aria-label={`Rating: ${rating} out of 5`}
        >
            {stars.map((star) => {
                const isFull = star <= Math.floor(rating);
                const isHalf = star === Math.ceil(rating) && !isFull;

                return (
                    <div key={star} className="relative">
                        <StarIcon
                            className="text-gray-300"
                            style={{ width: size, height: size }}
                        />

                        {isFull && (
                            <StarIcon
                                className="absolute top-0 left-0 text-amber-400 fill-amber-400"
                                style={{ width: size, height: size }}
                            />
                        )}

                        {isHalf && (
                            <StarIcon
                                className="absolute top-0 left-0 text-amber-400 fill-amber-400"
                                style={{
                                    width: size / 2,
                                    height: size,
                                    clipPath: "inset(0 50% 0 0)",
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Star;
