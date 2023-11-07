import { Review } from '@/types/review';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Icons } from '../ui/icons';

export function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt);

  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  // @ts-expect-error date formatting
  const formattedDate = date.toLocaleDateString('en-US', options);

  const totalStars = 5;
  const filledStars = review.starsGiven;
  const unfilledStars = totalStars - filledStars;

  const filledStarsArray = Array(filledStars)
    .fill(null)
    .map((_, index) => <Icons.star key={`filled-star-${index}`} className="h-[15px]" />);

  const unfilledStarsArray = Array(unfilledStars)
    .fill(null)
    .map((_, index) => <Icons.uncheckedStar key={`unfilled-star-${index}`} className="h-[15px]" />);

  return (
    <div className="bg-[#ABABAB] w-full rounded-xl px-4 py-3">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{review.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-xs">
            <p className="font-semibold text-black">{review.user.name}</p>
            <p className="text-gray-200">{formattedDate}</p>
          </div>
        </div>
        <div className=" bg-white rounded-full flex text-black px-2 items-center">
          {filledStarsArray}
          {unfilledStarsArray}
        </div>
      </div>
      <p className="mt-3 text-[15px] text-black">{review.content}</p>
    </div>
  );
}
