import React from 'react';
import { GraduationCap, User, LogOut } from 'lucide-react';
import { UserRole } from '@/types';

interface User {
   role: UserRole;
   username: string;
}

export default function Header({
   user,
   onLogout,
}: {
   user: User;
   onLogout: () => void;
}) {
   return (
      <div className="text-center mb-8">
         <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-4xl font-bold text-gray-800">OHA</h1>
            <div className="flex items-center gap-3">
               <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                     user.role === 'student'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                  }`}
               >
                  {user.role === 'student' ? (
                     <GraduationCap className="w-4 h-4" />
                  ) : (
                     <User className="w-4 h-4" />
                  )}
                  {user.username}
               </div>
               <button
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
               >
                  <LogOut className="w-4 h-4" />
               </button>
            </div>
         </div>
         <p className="text-gray-600">
            Translate English words and phrases to Igbo language
         </p>
         {user.role === 'teacher' && (
            <p className="text-green-600 text-sm mt-2">
               Teacher Mode: Access to all features and student progress
            </p>
         )}
      </div>
   );
}
