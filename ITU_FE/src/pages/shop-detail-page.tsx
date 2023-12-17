import UploadComponent from '@/components/file-upload/UploadDragDrop';
import { AverageRating } from '@/components/shop-detail/averageRating';
import { ReviewSection } from '@/components/shop-detail/reviews-section';
import { ShopToolBar } from '@/components/shop-detail/shop-tool-bar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shop } from '@/types/shop';
import { api_client } from '@/utils/api-client';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

export function ShopDetailPage() {
  const params = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['shopsDetailQuery'],
    queryFn: async () => {
      const { data } = await api_client.get(`shops/${params.id}`);
      return data as Shop;
    }
  });

  const apiURL = `${import.meta.env.VITE_API_URL}/api`;

  return (
    <div className="w-[min(1300px,95%)] bg-[#D9D9D9] dark:bg-slate-500 rounded-xl flex">
      <div className="bg-[#ABABAB] dark:bg-slate-700 w-1/3 rounded-xl px-8 py-5 flex flex-col items-center">
        {isLoading ? (
          <div className="flex items-center justify-center w-1/2 h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
            <svg
              className="w-10 h-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        ) : (
          <img src={data?.imageURL} className="rounded-lg w-full" />
        )}

        {!isLoading && data && <ShopToolBar shop={data} />}
        <div className="flex w-full justify-start text-sm mt-2">
          <p className="w-2/5">{data?.address}</p>
        </div>
        {data && <AverageRating average={data?.rating} nOfReviews={data.nOfReviews} />}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="mt-4">{data?.description}</p>
        )}
        <div className="flex flex-wrap w-full gap-3 mt-6">
          {data?.ShopTag.map((item, i) => (
            <Badge className="py-1 min-w-[60px] flex items-center justify-center" key={`detail_badge_${i}`}>
              {item.tag.title}
            </Badge>
          ))}
        </div>
        <div className="mt-6 w-full flex flex-col justify-start">
          <h1 className="font-bold">Opening hours</h1>
          <div className="flex flex-col mt-2">
            <div className="flex justify-between">
              <p>Monday - Friday</p>
              <p>8:00 - 17:00</p>
            </div>
            <div className="flex justify-between">
              <p>Saturday</p>
              <p>8:00 - 17:00</p>
            </div>
            <div className="flex justify-between">
              <p>Sunday</p>
              <p>Closed</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-2/3 px-8 py-8 flex flex-col items-center">
        <div className="w-full justify-start">
          <div className="flex justify-between">
            <h1 className="font-bold text-xl">Photos from customers</h1>
            <UploadComponent />
          </div>

          <div className="flex w-full space-x-4 mt-4">
            {data && data?.PhotoUpload.length > 0 ? (
              data?.PhotoUpload.map((item) => (
                <img src={`${apiURL}/shops/photo/${item.id}`} className="w-1/5" key={`photo-${item.id}`}></img>
              ))
            ) : (
              <p className="font-semibold text-red-500">No photos found</p>
            )}
          </div>
        </div>
        <ReviewSection />
      </div>
    </div>
  );
}
