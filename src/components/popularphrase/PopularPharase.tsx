import React from 'react';
import { BookOpen } from 'lucide-react';
import { popularPhrases, englishToIgbo } from '@/data/data';

// Add a type assertion to allow indexing
const englishToIgboMap: { [key: string]: string } = englishToIgbo;

interface PopularPhrasesProps {
   onPhraseSelect: (phrase: string, translation: string) => void;
}

export default function PopularPhrases({
   onPhraseSelect,
}: PopularPhrasesProps) {
   // Smart translation function
   const translateText = (text: string) => {
      if (!text.trim()) return '';

      const lowerText = text.toLowerCase();

      if (englishToIgboMap[lowerText]) {
         return englishToIgboMap[lowerText];
      }
      if ((englishToIgbo as { [key: string]: string })[lowerText]) {
         return (englishToIgbo as { [key: string]: string })[lowerText];
      }

      // Partial phrase matching
      for (const [english, igbo] of Object.entries(englishToIgbo)) {
         if (lowerText.includes(english) || english.includes(lowerText)) {
            return igbo;
         }
      }

      // Word-by-word translation
      const words = lowerText.split(' ');
      const translatedWords = words.map((word: string) => {
         const cleanWord = word.replace(/[^\w]/g, '');
         return (englishToIgbo as { [key: string]: string })[cleanWord] || word;
      });

      const result = translatedWords.join(' ');

      if (result === text.toLowerCase()) {
         return `${text} (translation not found)`;
      }

      return result;
   };

   return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
         <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Popular Phrases
         </h3>
         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularPhrases.map((phrase, index) => (
               <button
                  key={index}
                  onClick={() => onPhraseSelect(phrase, translateText(phrase))}
                  className="p-3 text-left bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border transition-colors"
               >
                  <div className="font-medium text-gray-800">{phrase}</div>
                  <div className="text-sm text-green-600">
                     {translateText(phrase)}
                  </div>
               </button>
            ))}
         </div>
      </div>
   );
}
