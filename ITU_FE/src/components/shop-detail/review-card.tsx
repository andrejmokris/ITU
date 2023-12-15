import { Review } from '@/types/review';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Icons } from '../ui/icons';
import useAuthStore from '@/store/user-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from 'react-query';
import { api_client } from '@/utils/api-client';
import { toast } from '../ui/use-toast';

export function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt);
  const userStore = useAuthStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['deleteReviewMutation'],
    mutationFn: async () => {
      const { data } = await api_client.delete(`reviews/${review.id}`, {
        withCredentials: true
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopReviewsQuery'] });
      queryClient.invalidateQueries({ queryKey: ['shopsDetailQuery'] });
      toast({
        title: 'Review deleted'
      });
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.'
      });
    }
  });

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
        <div className="flex space-x-2 justify-center items-center">
          <div className=" bg-white rounded-full flex text-black px-2 items-center py-2">
            {filledStarsArray}
            {unfilledStarsArray}
          </div>
          {userStore.user?.id === review.userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>Delete the review</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <p className="mt-3 text-[15px] text-black">{review.content}</p>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the review from the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutation.mutateAsync()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
