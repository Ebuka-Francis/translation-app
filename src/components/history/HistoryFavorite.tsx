import React from 'react';

interface HistoryAndFavoritesProps {
   translationHistory: {
      id: string;
      english: string;
      igbo: string;
      timestamp: string;
   }[];
   favorites: { id: string; english: string; igbo: string }[];
   onHistoryItemClick: (english: string, igbo: string) => void;
   onFavoriteItemClick: (english: string, igbo: string) => void;
   onRemoveFromFavorites: (id: string) => void;
}

export default function HistoryAndFavorites({
   translationHistory,
   favorites,
   onHistoryItemClick,
   onFavoriteItemClick,
   onRemoveFromFavorites,
}: HistoryAndFavoritesProps) {
   return (
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
                        onClick={() =>
                           onHistoryItemClick(item.english, item.igbo)
                        }
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
                     <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                           <div
                              className="flex-1 cursor-pointer"
                              onClick={() =>
                                 onFavoriteItemClick(item.english, item.igbo)
                              }
                           >
                              <div className="font-medium text-gray-800">
                                 {item.english}
                              </div>
                              <div className="text-green-600">{item.igbo}</div>
                           </div>
                           <button
                              onClick={() => onRemoveFromFavorites(item.id)}
                              className="text-red-500 hover:text-red-700 ml-2 text-lg"
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
   );
}
