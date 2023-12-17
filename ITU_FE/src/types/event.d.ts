export type ThriftEvent = {
  id: number;
  startDate: string;
  title: string;
  description: string;
  imageURL?: string;
  EventParticipation: Array<{
    userId: number;
  }>;
  authorId: number;
};
