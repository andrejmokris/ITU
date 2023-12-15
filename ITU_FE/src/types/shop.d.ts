type ShopTag = {
  id: number;
  shopId: number;
  tag: {
    id: number;
    title: string;
  };
};

export type Shop = {
  id: number;
  title: string;
  description: string;
  address: string;
  imageURL: string;
  latitude: number;
  longitude: number;
  ShopTag: Array<ShopTag>;
  rating: number;
  nOfReviews: number;
  PhotoUpload: Array<{ id: number }>;
};
