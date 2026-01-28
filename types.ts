
export enum View {
  POND = 'POND',
  WRITER = 'WRITER',
  CALENDAR = 'CALENDAR'
}

export interface RitualEntry {
  id: string;
  date: string; // ISO String
  content: string;
  summary: string;
  mood: string;
  seed: string;
}

export interface SeedResponse {
  prompt: string;
  theme: string;
}

export interface AnalysisResponse {
  summary: string;
  mood: string;
}
