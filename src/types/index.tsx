// types.ts (in a folder like src/types or similar)

export type TranslationDictionary = { [key: string]: string };
export type UserRole = 'student' | 'teacher';

export interface Users {
   id: string;
   username: string;
   role: UserRole;
}

export interface HistoryItem {
   id: number;
   english: string;
   igbo: string;
   timestamp: string;
}

export interface FavoriteItem {
   id: number;
   english: string;
   igbo: string;
   timestamp: string;
}

export interface VideoItem {
   id: string;
   title: string;
   description: string;
   url: string;
   thumbnail: string;
   uploadedBy: string;
   uploadDate: string;
   category: string;
}

export const mockUsers = [
   {
      id: '1',
      username: 'student1',
      password: 'student123',
      role: 'student' as UserRole,
   },
   {
      id: '2',
      username: 'teacher1',
      password: 'teacher123',
      role: 'teacher' as UserRole,
   },
   {
      id: '3',
      username: 'john_student',
      password: 'password',
      role: 'student' as UserRole,
   },
   {
      id: '4',
      username: 'mary_teacher',
      password: 'password',
      role: 'teacher' as UserRole,
   },
];

export const popularPhrases: string[] = [
   'hello',
   'thank you',
   'good morning',
   'how are you',
   'goodbye',
   'please',
   'yes',
   'no',
   'water',
   'food',
   'family',
   'love',
];

export const englishToIgbo: TranslationDictionary = {
   hello: 'ndewo',
   'thank you': 'dalu',
   'good morning': 'ụtụtụ ọma',
   'how are you': 'kedu ka ị mere',
   goodbye: 'ka ọ dị',
   please: 'biko',
   yes: 'ee',
   no: 'mba',
   water: 'mmiri',
   food: 'nri',
   family: 'ezinụlọ',
   love: 'ịhụnanya',
};
