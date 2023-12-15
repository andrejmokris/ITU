export type Review = {
  id: number;
  createdAt: string;
  content: string;
  imageURL: string?;
  starsGiven: number;
  priceRange: number;
  userId: number;
  user: {
    name: string;
  };
};
