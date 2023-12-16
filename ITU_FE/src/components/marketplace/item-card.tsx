import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { MarketPlaceItem } from '@/pages/marketplace-page';
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
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { api_client } from '@/utils/api-client';
import { toast } from '../ui/use-toast';
import useAuthStore from '@/store/user-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export function ItemCard({ item }: { item: MarketPlaceItem }) {
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const userStore = useAuthStore();

  let properties;

  try {
    properties = JSON.parse(item.addInfo);
  } catch (error) {
    console.log('invalid json');
  }

  function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char: string) => char.toUpperCase());
  }

  const apiURL = `${import.meta.env.VITE_API_URL}/api`;

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['buyNewItem'],

    mutationFn: async () => {
      const { data } = await api_client.post(`/marketplace/${item.id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketPlaceQuery'] });
      toast({
        title: 'You have successfully ordered the item'
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.'
      });
    }
  });

  const deleteMutation = useMutation({
    mutationKey: ['deleteItem'],

    mutationFn: async () => {
      const { data } = await api_client.delete(`/marketplace/${item.id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketPlaceQuery'] });
      toast({
        title: 'You have successfully deleted the item'
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.'
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholdefffr.svg" />
              <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-lg font-semibold">{capitalizeWords(item.title)}</h2>
              <span className="text-sm text-gray-500">Posted by {item.seller.name}</span>
            </div>
          </div>

          <div>
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
                {userStore.user?.id === item.seller.id && (
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>Delete the post</DropdownMenuItem>
                )}

                {item.ItemBookmark.length > 0 ? (
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>Unlike</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>Like</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <img
          className="w-full h-64 object-cover"
          height="200"
          src={`${apiURL}/marketplace/photo/${item.id}`}
          //src="/placeholder.svg"
          style={{
            aspectRatio: '200/200',
            objectFit: 'cover'
          }}
          width="200"
        />
        <p className="mt-4 text-gray-600">{item.description}</p>
      </CardContent>
      <CardFooter>
        <Badge className="mr-2">Size: {item.size}</Badge>
        {properties.color && <Badge className="mr-2">Color: {properties.color}</Badge>}
        <Badge>${item.price}</Badge>
        <Button
          className="ml-auto"
          onClick={() => setPurchaseDialogOpen(true)}
          disabled={!item.active || item.seller.id === userStore.user?.id}
        >
          {item.active ? 'Buy Now' : 'Not available'}
        </Button>
      </CardFooter>
      <AlertDialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>{`Confirm that you really want to buy ${item.title} for $${item.price}?`}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutation.mutateAsync()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This action cannot be undone. This will permanently delete the ${item.title} from the marketplace.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutateAsync()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}