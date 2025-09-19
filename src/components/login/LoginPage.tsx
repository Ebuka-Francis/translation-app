import React, { useState } from 'react';
import {
   GraduationCap,
   User,
   Eye,
   EyeOff,
   LogIn,
   UserPlus,
} from 'lucide-react';
import { UserRole, Users } from '@/types';
import { config } from '../api/api';
import api from '../services/httpServices';
interface LoginPageProps {
   onLogin: (user: Users) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
   const [isLoginMode, setIsLoginMode] = useState(true);
   const [selectedRole, setSelectedRole] = useState<UserRole>('student');
   const [username, setUsername] = useState('');
   const [userEmail, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const handleLogin = async () => {
      setError('');

      // Validation
      if (!userEmail || !password) {
         setError('Please fill in all fields');
         return;
      }

      try {
         const payload = {
            email: userEmail,
            password: password,
         };

         setIsLoading(true);
         console.log('login payload', payload);

         const response = await api.post(
            `${config.baseUrl}${config.endpoints.login}`,
            payload
         );

         // Handle successful login
         if (response.data) {
            // The API should return user info including role
            onLogin({
               id: response.data.id || response.data.user?.id,
               username:
                  response.data.username ||
                  response.data.user?.name ||
                  response.data.name,
               role: response.data.role || response.data.user?.role,
            });
         }
      } catch (error: unknown) {
         console.log('error logging in', error);
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
            setError('Login failed. Please try again.');
         }
      } finally {
         setIsLoading(false);
      }
   };

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
         console.log('register payload', payload);
         console.log(`${config.baseUrl}${config.endpoints.register}`);
         const response = await api.post(
            `${config.baseUrl}${config.endpoints.register}`,
            payload
         );

         // Handle successful registration
         if (response.data) {
            // Call the onLogin prop to update parent component
            onLogin({
               id: response.data.id || username,
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
      setEmail(demoUser.email);
      setPassword(demoUser.password);
   };

   const toggleMode = () => {
      setIsLoginMode(!isLoginMode);
      setError('');
      // Clear form when switching modes
      setUsername('');
      setEmail('');
      setPassword('');
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold text-gray-800 mb-2">OHA</h1>
               <p className="text-gray-600">
                  {isLoginMode ? 'Login to continue' : 'Register to continue'}
               </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
               <button
                  onClick={() => setIsLoginMode(true)}
                  className={`flex-1 py-2 px-4 rounded-md transition-all flex items-center justify-center gap-2 ${
                     isLoginMode
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-blue-600'
                  }`}
               >
                  <LogIn className="w-4 h-4" />
                  Login
               </button>
               <button
                  onClick={() => setIsLoginMode(false)}
                  className={`flex-1 py-2 px-4 rounded-md transition-all flex items-center justify-center gap-2 ${
                     !isLoginMode
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-blue-600'
                  }`}
               >
                  <UserPlus className="w-4 h-4" />
                  Register
               </button>
            </div>

            {/* Role Selection - Only show for registration */}
            {!isLoginMode && (
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
            )}

            {/* Form */}
            <div className="space-y-4">
               {/* Username - Only show for registration */}
               {!isLoginMode && (
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
               )}

               {/* Email */}
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

               {/* Password */}
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
                  onClick={isLoginMode ? handleLogin : handleRegister}
                  disabled={
                     (!isLoginMode && (!username || !userEmail || !password)) ||
                     (isLoginMode && (!userEmail || !password)) ||
                     isLoading
                  }
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                     !isLoginMode && selectedRole === 'student'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : !isLoginMode && selectedRole === 'teacher'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
               >
                  {isLoading
                     ? isLoginMode
                        ? 'Logging in...'
                        : 'Registering...'
                     : isLoginMode
                     ? 'Login'
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
                     <strong>Student:</strong> student1@example.com / student123
                  </button>
                  <button
                     onClick={() => handleQuickLogin('teacher')}
                     className="w-full text-left text-xs bg-white p-2 rounded border hover:bg-green-50"
                  >
                     <strong>Teacher:</strong> teacher1@example.com / teacher123
                  </button>
               </div>
               <button
                  onClick={toggleMode}
                  className="mt-4 w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
               >
                  {isLoginMode ? 'Register instead' : 'Login instead'}
               </button>
            </div>
         </div>
      </div>
   );
}
