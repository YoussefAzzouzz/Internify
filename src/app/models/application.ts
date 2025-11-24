export interface Application {
  id: number;
  cv: string;
  motivationLetter: string;
  status: string;
  offerId?: number;
  userId?: number;
  accepted: number;     // 0 or 1
  matchScore: number;   // 0.0 - 1.0
  skills?: string;
  experience?: number;
  cvScore?: number;
  postDate?: string;
}