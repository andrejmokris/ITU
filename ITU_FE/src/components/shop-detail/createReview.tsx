/**
 * Author: Veronika Simkova xsimko14
 */

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '../ui/icons';
import { api_client } from '@/utils/api-client';

export function CreateReview({ id }: { id: number }) {
  const numbers = [1, 2, 3, 4, 5];
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [pickedValue, setPickedValue] = useState<number>(0);
  const [comment, setComment] = useState('');

  const mutation = useMutation({
    mutationKey: ['CreateReviewMutation'],
    mutationFn: async () => {
      await api_client.post(
        `reviews`,
        { shopId: id, rating: pickedValue, comment: comment },
        {
          withCredentials: true
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopReviewsQuery'] });
      queryClient.invalidateQueries({ queryKey: ['shopsDetailQuery'] });
      toast({
        title: 'Review Created'
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error occured',
        description: 'There was a problem with request. Try again'
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create new Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Review</DialogTitle>
          <DialogDescription>Create a new review. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Rating
            </Label>
            <div className="col-span-3 space-x-2">
              {numbers.map((number) => {
                return (
                  <Button
                    key={`reviewButton-${number}`}
                    className={`rounded-full ${
                      pickedValue > 0 && pickedValue === number && 'bg-gray-400 hover:bg-gray-400'
                    }`}
                    onClick={() => setPickedValue(number)}
                  >
                    {number}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comment" className="text-right">
              Comment
            </Label>
            <Textarea
              id="comment"
              placeholder="Enter the review text"
              className="col-span-3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></Textarea>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => mutation.mutateAsync()}>
            {mutation.isLoading ? <Icons.spinner className="animate-spin" /> : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
