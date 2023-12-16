import { SearchIcon } from 'lucide-react';
import { ItemCard } from '@/components/marketplace/item-card';
import { useQuery } from 'react-query';
import { api_client } from '@/utils/api-client';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export type MarketPlaceItem = {
  id: number;
  title: string;
  description: string;
  price: number;
  seller: {
    name: string;
    id: number;
  };
  size: string;
  addInfo: string;
  active: boolean;
};

export function MarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams({ q: '' });
  const [showSold, setShowSold] = useState(false);
  const q = searchParams.get('q');

  // @ts-expect-error works
  const query_val = useDebounce(q, 400);

  const { data } = useQuery({
    queryKey: ['marketPlaceQuery', query_val],
    queryFn: async () => {
      const { data } = await api_client.get('marketplace', {
        params: searchParams
      });
      return data as Array<MarketPlaceItem>;
    }
  });

  return (
    <main className="p-4 md:p-6 lg:p-8 w-full flex items-center justify-center">
      <div className="flex flex-col w-[min(1400px,95%)] items-center justify-center">
        <div className="flex items-center justify-between mb-6 w-full">
          <h1 className="text-2xl font-semibold">Marketplace</h1>
          <div className="flex items-center">
            <SearchIcon className="h-4 w-4 text-gray-500" />
            <input
              className="w-full bg-white shadow-none appearance-none pl-8 md:w-3/3 lg:w-2/3 dark:bg-gray-950"
              placeholder="Search items..."
              type="search"
              // @ts-expect-error test
              value={q}
              onChange={(e) =>
                setSearchParams((prev) => {
                  prev.set('q', e.target.value);
                  return prev;
                })
              }
            />
          </div>
        </div>
        <div className="w-full flex justify-start">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" checked={showSold} onCheckedChange={() => setShowSold(!showSold)} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show sold items
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {showSold
            ? data?.map((item) => <ItemCard item={item} key={`marketPlaceItem${item.id}`} />)
            : data
                ?.filter((item) => item.active)
                .map((item) => <ItemCard item={item} key={`marketPlaceItem${item.id}`} />)}
        </div>
      </div>
    </main>
  );
}
