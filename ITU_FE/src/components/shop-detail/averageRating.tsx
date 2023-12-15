import { Icons } from '../ui/icons';

export function AverageRating({ average, nOfReviews }: { average: number; nOfReviews: number }) {
  if (average > 5) {
    average = 5;
  }
  const totalStars = 5;
  const filledStars = Math.round(average);
  const unfilledStars = totalStars - filledStars;

  const filledStarsArray = Array(filledStars)
    .fill(null)
    .map((_, index) => <Icons.star key={`filled-star-${index}`} className="h-[15px]" />);

  const unfilledStarsArray = Array(unfilledStars)
    .fill(null)
    .map((_, index) => <Icons.uncheckedStar key={`unfilled-star-${index}`} className="h-[15px]" />);

  return (
    <div className="w-full mt-2">
      <div className="w-2/5 bg-white rounded-full flex text-black px-2 items-center py-1">
        <p className="text-sm font-bold pr-2">{average.toFixed(1)}</p>
        {filledStarsArray}
        {unfilledStarsArray}
      </div>
      <p className="text-xs mt-1 underline">
        {nOfReviews} {nOfReviews == 1 ? 'Review' : 'Reviews'}
      </p>
    </div>
  );
}
