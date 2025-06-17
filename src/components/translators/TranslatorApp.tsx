import React, { useState } from 'react';
import { Volume2, Search, Star, Copy } from 'lucide-react';
import { EnglishToIgbo } from '../data/data';

interface TranslationInterfaceProps {
   englishText: string;
   setEnglishText: (text: string) => void;
   igboText: string;
   setIgboText: (text: string) => void;
   onTranslate: () => void;
   onAddToFavorites: () => void;
   isTranslating: boolean;
}

export default function TranslationInterface({
   englishText,
   setEnglishText,
   igboText,
   setIgboText,
   onTranslate,
   onAddToFavorites,
   isTranslating,
}: TranslationInterfaceProps) {
   const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

   // Handle input change with suggestions
   const handleInputChange = (value: string) => {
      setEnglishText(value);

      if (value.length > 1) {
         const suggestions = Object.keys(EnglishToIgbo)
            .filter((key) => key.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 5);
         setSearchSuggestions(suggestions);
      } else {
         setSearchSuggestions([]);
      }
   };

   // Copy to clipboard
   const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
   };

   // Text-to-speech
   interface SpeakTextOptions {
      text: string;
      lang?: 'en' | 'igbo';
   }

   const speakText = ({ text, lang = 'en' }: SpeakTextOptions): void => {
      if ('speechSynthesis' in window) {
         const utterance = new SpeechSynthesisUtterance(text);
         utterance.lang = lang === 'igbo' ? 'ig-NG' : 'en-US';
         speechSynthesis.speak(utterance);
      }
   };

   const clearInputs = () => {
      setEnglishText('');
      setIgboText('');
      setSearchSuggestions([]);
   };

   return (
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
                     onClick={() => speakText({ text: englishText })}
                     className="absolute top-2 right-2 p-2 text-gray-500 hover:text-green-600 transition-colors"
                     disabled={!englishText}
                  >
                     <Volume2 className="w-4 h-4" />
                  </button>
               </div>

               {/* Search Suggestions */}
               {searchSuggestions.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                     <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
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
                           onClick={() =>
                              speakText({ text: igboText, lang: 'igbo' })
                           }
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
               onClick={onTranslate}
               disabled={!englishText.trim() || isTranslating}
               className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
               <Search className="w-4 h-4" />
               {isTranslating ? 'Translating...' : 'Translate'}
            </button>

            {igboText && (
               <button
                  onClick={onAddToFavorites}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
               >
                  <Star className="w-4 h-4" />
                  Add to Favorites
               </button>
            )}

            <button
               onClick={clearInputs}
               className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
               Clear
            </button>
         </div>
      </div>
   );
}
