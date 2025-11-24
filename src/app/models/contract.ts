export interface Contract {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  entrepriseId: number; // To filter contracts by entreprise
}
