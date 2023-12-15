import { useQuery } from 'react-query';
import { Button } from '../ui/button';
import { ReviewCard } from './review-card';
import { api_client } from '@/utils/api-client';
import { useParams } from 'react-router-dom';
import { Review } from '@/types/review';
import { CreateReview } from './createReview';
import { useState } from 'react';

export function ReviewSection() {
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const { data } = useQuery({
    queryKey: ['shopReviewsQuery'],
    queryFn: async () => {
      const { data } = await api_client.get(`reviews/${params.id}`);
      return data as Array<Review>;
    }
  });

  return (
    <div className="w-full mt-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">Reviews</h1>
        <CreateReview id={Number(params.id)} />
      </div>
      <div className="mt-6 flex flex-col space-y-4">
        {data?.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      <div className="flex space-x-2 justify-end mt-4">
        <Button variant={'outline'} onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage == 0}>
          Previous
        </Button>
        <Button
          variant={'outline'}
          onClick={() => setCurrentPage(currentPage + 1)}
          // @ts-expect-error test
          disabled={currentPage * itemsPerPage >= Math.floor(data?.length / itemsPerPage)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
