export interface CalendarEvent {
  id?: string;
  date: Date;
  nom: string;
  prenoms: string;
  theme: string;
  heure: string;
  type: 'atelier' | 'formation';
  description: string;
}