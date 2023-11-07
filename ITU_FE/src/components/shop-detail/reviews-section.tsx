import { Button } from '../ui/button';
import { ReviewCard } from './review-card';

export function ReviewSection() {
  return (
    <div className="w-full mt-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">Reviews</h1>
        <Button className="rounded-full font-bold text-lg h-[30px] w-[30px] flex items-center justify-center">
          <p>+</p>
        </Button>
      </div>
      <div className="mt-6 flex flex-col space-y-4">
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
      </div>
      <div className="flex space-x-2 justify-end">
        <Button variant="outline" size="sm" className="mt-2">
          Previous
        </Button>
        <Button variant="outline" size="sm" className="mt-2">
          Next
        </Button>
      </div>
    </div>
  );
}
