export interface Tournament {
  id?: string;
  title: string;
  description: string;
  gameMode: '5v5' | '1v1' | 'TFT';
  maxTeams: number;
  startDate: string;
  status: 'pending' | 'open' | 'ongoing' | 'finished' | 'cancelled';
  entryFee: number;
  prizePool: string;
  createdBy: string;
  bannerUrl?: string;
  contactInfo?: string; // Novo campo de contato
}