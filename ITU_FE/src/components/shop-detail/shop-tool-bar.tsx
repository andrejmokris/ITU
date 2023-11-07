import { Shop } from '@/types/shop';
import { Icons } from '../ui/icons';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { api_client } from '@/utils/api-client';
import { useParams } from 'react-router-dom';

export function ShopToolBar({ shop }: { shop: Shop }) {
  const queryClient = useQueryClient();
  const params = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['shopsDetailToolbarQuery'],
    queryFn: async () => {
      const { data } = await api_client.get(`follows/${params.id}`);
      return data.follow as boolean;
    }
  });

  const mutation = useMutation({
    mutationKey: ['shopDetailToolbarMutation'],
    mutationFn: async () => {
      // toggle state of follow
      if (data) {
        return await api_client.delete(`follows/${params.id}`);
      } else {
        return await api_client.post(`follows/${params.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('shopsDetailToolbarQuery');
    }
  });

  return (
    <div className="flex justify-between w-full mt-3">
      <p className="font-bold">{shop?.title}</p>
      <div className="flex space-x-3 text-sm">
        <a href={`http://www.google.com/maps/place/${shop?.longitude},${shop?.latitude}`} target="_blank">
          <Icons.navigate />
        </a>
        <Icons.notification />
        <button onClick={() => mutation.mutateAsync()}>
          <Icons.heart className={`${isLoading ? 'animate-pulse' : data && 'fill-red-500'}`} />
        </button>
      </div>
    </div>
  );
}
