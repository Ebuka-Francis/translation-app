import React from 'react';
import { Globe } from 'lucide-react';

export default function Header() {
   return (
      <div className="text-center mb-8">
         <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="text-green-600 w-8 h-8" />
            <h1 className="text-4xl font-bold text-gray-800">OHA</h1>
         </div>
         <p className="text-gray-600">
            Translate English to Igbo language instantly
         </p>
      </div>
   );
}
