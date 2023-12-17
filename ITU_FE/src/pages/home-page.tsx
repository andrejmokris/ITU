/**
 * Author: Veronika Simkova xsimko14
 */

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useQuery } from 'react-query';
import { Shop } from '@/types/shop';
import { useEffect, useState } from 'react';
import ShopListComponent from '@/components/shop-list-component';
import { MapController } from '@/components/map-controller';
import { api_client } from '@/utils/api-client';
import { SearchBar } from '@/components/search-bar';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(3);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const q = searchParams.get('q');
  const tags = searchParams.get('tags');
  const followed = searchParams.get('followed');

  // @ts-expect-error param will be found
  const debouncedSearchTerm = useDebounce(q, 300);
  // @ts-expect-error param will be found
  const debouncedTag = useDebounce(tags, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['shopsQuery', debouncedSearchTerm, debouncedTag, followed],
    queryFn: async () => {
      const { data } = await api_client.get('shops', {
        params: searchParams
      });
      return data as Array<Shop>;
    },
    onSuccess: () => {
      setCurrentPage(0);
    }
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    } else {
      console.log('Geolocation is not available in your browser.');
    }
  }, []);

  return (
    <div className="flex flex-col w-[min(1400px,95%)]">
      <SearchBar />
      <div className="w-full flex">
        <div className="w-1/2 px-3">
          <div className="space-y-2">
            {(!data || data.length == 0) && !isLoading && (
              <p className="font-bold text-red-500 text-center">Nothing to show</p>
            )}
            {data?.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage).map((shop) => (
              <ShopListComponent
                shop={shop}
                position={position}
                setSelectedShop={setSelectedShop}
                selectedShop={selectedShop}
                key={`${shop.id}_key`}
              />
            ))}
            <div className="flex w-full justify-between">
              <Button variant={'outline'} onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage == 0}>
                Previous Page
              </Button>
              <Button
                variant={'outline'}
                onClick={() => setCurrentPage(currentPage + 1)}
                // @ts-expect-error test
                disabled={currentPage * itemsPerPage >= Math.floor(data?.length / itemsPerPage)}
              >
                Next Page
              </Button>
            </div>
          </div>
        </div>
        <div className="w-1/2 min-h-[650px]">
          <MapContainer center={[49.19469087608702, 16.61131840963104]} zoom={14} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController
              // @ts-expect-error test
              selectedShop={selectedShop}
            />
            {data?.map((shop) => (
              <Marker position={[shop.longitude, shop.latitude]} key={`market-${shop.id}`}>
                <Popup>{shop.title}</Popup>
              </Marker>
            ))}
            <Marker position={[position.latitude, position.longitude]} key={`market-your_location`}>
              <Popup>
                <div className="text-red-500">Your location</div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
