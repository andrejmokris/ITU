import { useQuery } from 'react-query';
import { Button } from '../ui/button';
import { ReviewCard } from './review-card';
import { api_client } from '@/utils/api-client';
import { useParams } from 'react-router-dom';
import { Review } from '@/types/review';

export function ReviewSection() {
  const params = useParams();

  const { data } = useQuery({
    queryKey: ['shopsDetailQuery'],
    queryFn: async () => {
      const { data } = await api_client.get(`reviews/${params.id}`);
      return data as Array<Review>;
    }
  });

  return (
    <div className="w-full mt-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">Reviews</h1>
        <Button className="rounded-full font-bold text-lg h-[30px] w-[30px] flex items-center justify-center">
          <p>+</p>
        </Button>
      </div>
      <div className="mt-6 flex flex-col space-y-4">
        {data?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
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
