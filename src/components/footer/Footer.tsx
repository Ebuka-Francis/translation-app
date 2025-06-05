import React from 'react';

import { EnglishToIgbo } from '../data/data';

type TranslationDictionary = { [key: string]: string };

const englishToIgbo: TranslationDictionary = EnglishToIgbo;

export default function Footer() {
   return (
      <div className="text-center mt-8 text-gray-600">
         <p>Built with ❤️ for Igbo language preservation</p>
         <p className="text-sm">
            Dictionary contains {Object.keys(englishToIgbo).length} translations
         </p>
      </div>
   );
}
