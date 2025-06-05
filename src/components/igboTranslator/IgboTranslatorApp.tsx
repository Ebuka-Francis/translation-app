'use client';
import React, { useState, useEffect } from 'react';
import { Volume2, Copy, Search, Star, BookOpen } from 'lucide-react';

import { EnglishToIgbo } from '../data/data';
import Footer from '../footer/Footer';
import Header from '../header/Header';

// Type definitions
type TranslationDictionary = { [key: string]: string };

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

// Dictionary and popular phrases
const englishToIgbo: TranslationDictionary = EnglishToIgbo;

const popularPhrases: string[] = [
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

export default function IgboTranslatorApp() {
   const [englishText, setEnglishText] = useState<string>('');
   const [igboText, setIgboText] = useState<string>('');
   const [isTranslating, setIsTranslating] = useState<boolean>(false);
   const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
   const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
   const [translationHistory, setTranslationHistory] = useState<HistoryItem[]>(
      []
   );

   // Load favorites and history from localStorage on component mount
   useEffect(() => {
      const savedFavorites = JSON.parse(
         localStorage.getItem('igbo-favorites') || '[]'
      ) as FavoriteItem[];
      const savedHistory = JSON.parse(
         localStorage.getItem('igbo-history') || '[]'
      ) as HistoryItem[];
      setFavorites(savedFavorites);
      setTranslationHistory(savedHistory);
   }, []);

   // Smart translation function
   const translateText = (text: string): string => {
      if (!text.trim()) return '';

      const lowerText = text.toLowerCase();

      // Direct match
      if (englishToIgbo[lowerText]) {
         return englishToIgbo[lowerText];
      }

      // Partial phrase matching
      for (const [english, igbo] of Object.entries(englishToIgbo)) {
         if (lowerText.includes(english) || english.includes(lowerText)) {
            return igbo;
         }
      }

      // Word-by-word translation
      const words = lowerText.split(' ');
      const translatedWords = words.map((word) => {
         // Remove punctuation for translation
         const cleanWord = word.replace(/[^\w]/g, '');
         return englishToIgbo[cleanWord] || word;
      });

      const result = translatedWords.join(' ');

      // If no translation found, return original with note
      if (result === text.toLowerCase()) {
         return `${text} (translation not found)`;
      }

      return result;
   };

   // Handle translation
   const handleTranslate = (): void => {
      if (!englishText.trim()) return;

      setIsTranslating(true);

      // Simulate translation delay for better UX
      setTimeout(() => {
         const translation = translateText(englishText);
         setIgboText(translation);

         // Add to history
         const newHistoryItem: HistoryItem = {
            id: Date.now(),
            english: englishText,
            igbo: translation,
            timestamp: new Date().toLocaleString(),
         };

         const updatedHistory = [
            newHistoryItem,
            ...translationHistory.slice(0, 9),
         ]; // Keep last 10
         setTranslationHistory(updatedHistory);
         localStorage.setItem('igbo-history', JSON.stringify(updatedHistory));

         setIsTranslating(false);
      }, 500);
   };

   // Handle input change with suggestions
   const handleInputChange = (value: string): void => {
      setEnglishText(value);

      if (value.length > 1) {
         const suggestions = Object.keys(englishToIgbo)
            .filter((key) => key.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 5);
         setSearchSuggestions(suggestions);
      } else {
         setSearchSuggestions([]);
      }
   };

   // Add to favorites
   const addToFavorites = (): void => {
      if (!englishText.trim() || !igboText.trim()) return;

      const newFavorite: FavoriteItem = {
         id: Date.now(),
         english: englishText,
         igbo: igboText,
      };

      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      localStorage.setItem('igbo-favorites', JSON.stringify(updatedFavorites));
   };

   // Remove from favorites
   const removeFromFavorites = (id: number): void => {
      const updatedFavorites = favorites.filter((fav) => fav.id !== id);
      setFavorites(updatedFavorites);
      localStorage.setItem('igbo-favorites', JSON.stringify(updatedFavorites));
   };

   // Copy to clipboard
   const copyToClipboard = (text: string): void => {
      navigator.clipboard.writeText(text);
   };

   // Text-to-speech (if supported)
   const speakText = (text: string, lang: string = 'en'): void => {
      if ('speechSynthesis' in window) {
         const utterance = new SpeechSynthesisUtterance(text);
         utterance.lang = lang === 'igbo' ? 'ig-NG' : 'en-US';
         speechSynthesis.speak(utterance);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
         <div className="max-w-6xl mx-auto">
            {/* Header */}
            <Header />

            {/* Main Translation Interface */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
               <div className="grid md:grid-cols-2 gap-6">
                  {/* English Input */}
                  <div className="space-y-4">
                     <label className="block text-sm font-semibold text-gray-700">
                        English Text
                     </label>
                     <div className="relative">
                        <textarea
                           value={englishText}
                           onChange={(e) => handleInputChange(e.target.value)}
                           className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
                           placeholder="Type English text here..."
                        />
                        <button
                           onClick={() => speakText(englishText)}
                           className="absolute top-2 right-2 p-2 text-gray-500 hover:text-green-600 transition-colors"
                        >
                           <Volume2 className="w-4 h-4" />
                        </button>
                     </div>

                     {/* Search Suggestions */}
                     {searchSuggestions.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3">
                           <p className="text-sm text-gray-600 mb-2">
                              Suggestions:
                           </p>
                           <div className="flex flex-wrap gap-2">
                              {searchSuggestions.map((suggestion, index) => (
                                 <button
                                    key={index}
                                    onClick={() => {
                                       setEnglishText(suggestion);
                                       setSearchSuggestions([]);
                                    }}
                                    className="px-3 py-1 bg-white border rounded-full text-sm hover:bg-green-50 transition-colors"
                                 >
                                    {suggestion}
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Igbo Output */}
                  <div className="space-y-4">
                     <label className="block text-sm font-semibold text-gray-700">
                        Igbo Translation
                     </label>
                     <div className="relative">
                        <textarea
                           value={igboText}
                           readOnly
                           className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg bg-gray-50 resize-none"
                           placeholder="Igbo translation will appear here..."
                        />
                        {igboText && (
                           <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                 onClick={() => speakText(igboText, 'igbo')}
                                 className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                              >
                                 <Volume2 className="w-4 h-4" />
                              </button>
                              <button
                                 onClick={() => copyToClipboard(igboText)}
                                 className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                              >
                                 <Copy className="w-4 h-4" />
                              </button>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-wrap gap-4 mt-6 justify-center">
                  <button
                     onClick={handleTranslate}
                     disabled={!englishText.trim() || isTranslating}
                     className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                     <Search className="w-4 h-4" />
                     {isTranslating ? 'Translating...' : 'Translate'}
                  </button>

                  {igboText && (
                     <button
                        onClick={addToFavorites}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                     >
                        <Star className="w-4 h-4" />
                        Add to Favorites
                     </button>
                  )}

                  <button
                     onClick={() => {
                        setEnglishText('');
                        setIgboText('');
                        setSearchSuggestions([]);
                     }}
                     className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                     Clear
                  </button>
               </div>
            </div>

            {/* Popular Phrases */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
               <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Popular Phrases
               </h3>
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {popularPhrases.map((phrase, index) => (
                     <button
                        key={index}
                        onClick={() => {
                           setEnglishText(phrase);
                           setIgboText(translateText(phrase));
                        }}
                        className="p-3 text-left bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border transition-colors"
                     >
                        <div className="font-medium text-gray-800">
                           {phrase}
                        </div>
                        <div className="text-sm text-green-600">
                           {translateText(phrase)}
                        </div>
                     </button>
                  ))}
               </div>
            </div>

            {/* Bottom Section: History and Favorites */}
            <div className="grid md:grid-cols-2 gap-8">
               {/* Translation History */}
               {translationHistory.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                     <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Recent Translations
                     </h3>
                     <div className="space-y-3 max-h-64 overflow-y-auto">
                        {translationHistory.map((item) => (
                           <div
                              key={item.id}
                              className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                 setEnglishText(item.english);
                                 setIgboText(item.igbo);
                              }}
                           >
                              <div className="font-medium text-gray-800">
                                 {item.english}
                              </div>
                              <div className="text-green-600">{item.igbo}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                 {item.timestamp}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* Favorites */}
               {favorites.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                     <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Favorites
                     </h3>
                     <div className="space-y-3 max-h-64 overflow-y-auto">
                        {favorites.map((item) => (
                           <div
                              key={item.id}
                              className="p-3 bg-gray-50 rounded-lg"
                           >
                              <div className="flex justify-between items-start">
                                 <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => {
                                       setEnglishText(item.english);
                                       setIgboText(item.igbo);
                                    }}
                                 >
                                    <div className="font-medium text-gray-800">
                                       {item.english}
                                    </div>
                                    <div className="text-green-600">
                                       {item.igbo}
                                    </div>
                                 </div>
                                 <button
                                    onClick={() => removeFromFavorites(item.id)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                 >
                                    ×
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>

            {/* Footer */}
            <Footer />
         </div>
      </div>
   );
}
