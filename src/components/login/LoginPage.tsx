import React, { useState } from 'react';
import { GraduationCap, User, Eye, EyeOff } from 'lucide-react';
import { UserRole, Users } from '@/types';
import axios from 'axios';
import { config } from '../api/api';

interface LoginPageProps {
   onLogin: (user: Users) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
   const [selectedRole, setSelectedRole] = useState<UserRole>('student');
   const [username, setUsername] = useState('');
   const [userEmail, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const handleRegister = async () => {
      setError('');

      // Validation
      if (!username || !userEmail || !password) {
         setError('Please fill in all fields');
         return;
      }

      try {
         const payload = {
            name: username,
            email: userEmail,
            password: password,
            role: selectedRole,
         };

         setIsLoading(true);
         console.log('payload', payload);

         const response = await axios.post(
            `${config.baseUrl}${config.endpoints.register}`,
            payload
         );

         // Handle successful registration
         if (response.data) {
            // Call the onLogin prop to update parent component
            onLogin({
               id: response.data.id || username, // Use response ID or fallback
               username: username,
               role: selectedRole,
            });
         }
      } catch (error: unknown) {
         console.log('error registering', error);
         if (
            typeof error === 'object' &&
            error !== null &&
            'response' in error &&
            typeof (error as { response?: { data?: { message?: string } } })
               .response === 'object' &&
            (error as { response?: { data?: { message?: string } } }).response
               ?.data?.message
         ) {
            setError(
               (error as { response: { data: { message: string } } }).response
                  .data.message
            );
         } else {
            setError('Registration failed. Please try again.');
         }
      } finally {
         setIsLoading(false);
      }
   };

   const handleQuickLogin = (role: UserRole) => {
      const demoUser =
         role === 'student'
            ? {
                 username: 'student1',
                 email: 'student1@example.com',
                 password: 'student123',
              }
            : {
                 username: 'teacher1',
                 email: 'teacher1@example.com',
                 password: 'teacher123',
              };

      setSelectedRole(role);
      setUsername(demoUser.username);
      setEmail(demoUser.email); // Fix: Set email too
      setPassword(demoUser.password);
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold text-gray-800 mb-2">OHA</h1>
               <p className="text-gray-600">Register to continue</p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               <button
                  onClick={() => setSelectedRole('student')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                     selectedRole === 'student'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                  }`}
               >
                  <GraduationCap className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Student</div>
               </button>

               <button
                  onClick={() => setSelectedRole('teacher')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                     selectedRole === 'teacher'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                  }`}
               >
                  <User className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Teacher</div>
               </button>
            </div>

            {/* Registration Form */}
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Username
                  </label>
                  <input
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Enter your username"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Email
                  </label>
                  <input
                     type="email"
                     value={userEmail}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Enter your email"
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Password
                  </label>
                  <div className="relative">
                     <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        placeholder="Enter your password"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                     >
                        {showPassword ? (
                           <EyeOff className="w-4 h-4" />
                        ) : (
                           <Eye className="w-4 h-4" />
                        )}
                     </button>
                  </div>
               </div>

               {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                     {error}
                  </div>
               )}

               <button
                  onClick={handleRegister}
                  disabled={!username || !userEmail || !password || isLoading}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                     selectedRole === 'student'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
               >
                  {isLoading
                     ? 'Registering...'
                     : `Register as ${
                          selectedRole.charAt(0).toUpperCase() +
                          selectedRole.slice(1)
                       }`}
               </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
               <p className="text-sm text-gray-600 mb-3">Demo Credentials:</p>
               <div className="space-y-2">
                  <button
                     onClick={() => handleQuickLogin('student')}
                     className="w-full text-left text-xs bg-white p-2 rounded border hover:bg-blue-50"
                  >
                     <strong>Student:</strong> student1 / student1@example.com /
                     student123
                  </button>
                  <button
                     onClick={() => handleQuickLogin('teacher')}
                     className="w-full text-left text-xs bg-white p-2 rounded border hover:bg-green-50"
                  >
                     <strong>Teacher:</strong> teacher1 / teacher1@example.com /
                     teacher123
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
