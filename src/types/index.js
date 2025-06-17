// Type definitions for the Igbo Translator App

// User related types
export const USER_ROLES = {
   STUDENT: 'student',
   TEACHER: 'teacher',
};

// Interface structures (for documentation - these would be TypeScript interfaces)
/*
interface User {
   id: string;
   username: string;
   role: 'student' | 'teacher';
}

interface HistoryItem {
   id: number;
   english: string;
   igbo: string;
   timestamp: string;
}

interface FavoriteItem {
   id: number;
   english: string;
   igbo: string;
}

interface VideoItem {
   id: number;
   title: string;
   description: string;
   url: string;
   thumbnail: string;
   uploadedBy: string;
   uploadDate: string;
   category: string;
}

interface TranslationDictionary {
   [key: string]: string;
}
*/

// Helper functions for type checking
export const isValidUserRole = (role) => {
   return Object.values(USER_ROLES).includes(role);
};

export const createUser = (id, username, role) => ({
   id,
   username,
   role,
});

export const createHistoryItem = (english, igbo) => ({
   id: Date.now(),
   english,
   igbo,
   timestamp: new Date().toLocaleString(),
});

export const createFavoriteItem = (english, igbo) => ({
   id: Date.now(),
   english,
   igbo,
});

export const createVideoItem = (
   title,
   description,
   url,
   uploadedBy,
   category
) => ({
   id: Date.now(),
   title,
   description,
   url,
   thumbnail: '/api/placeholder/320/180',
   uploadedBy,
   uploadDate: new Date().toLocaleDateString(),
   category,
});
