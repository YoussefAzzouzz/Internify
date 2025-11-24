export interface Comment {
    id?: number;
    content: string;
    creationDate: Date;
    offerId: number;
    userId: number;
    sentiment?: string;
  }
