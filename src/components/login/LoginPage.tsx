// import React, { useState } from 'react';
// import { GraduationCap, User, Eye, EyeOff } from 'lucide-react';
// import { UserRole, Users } from '@/types';

// interface LoginPageProps {
//    onLogin: (user: { id: string; username: string; role: string }) => void;
// }

// export default function LoginPage({ onLogin }: LoginPageProps) {
//    const [selectedRole, setSelectedRole] = useState('');
//    const [username, setUsername] = useState('');
//    const [password, setPassword] = useState('');
//    const [showPassword, setShowPassword] = useState(false);
//    const [error, setError] = useState('');
//    const [isLoading, setIsLoading] = useState(false);

//    const mockUsers = [
//       {
//          id: '1',
//          username: 'student1',
//          password: 'student123',
//          role: 'student',
//       },
//       {
//          id: '2',
//          username: 'teacher1',
//          password: 'teacher123',
//          role: 'teacher',
//       },
//    ];

//    const handleLogin = () => {
//       setError('');
//       setIsLoading(true);

//       // Simulate API call delay
//       setTimeout(() => {
//          const user = mockUsers.find(
//             (u) =>
//                u.username === username &&
//                u.password === password &&
//                u.role === selectedRole
//          );

//          if (user) {
//             onLogin(Users(user.id, user.username, user.role));
//          } else {
//             setError('Invalid credentials or wrong role selected');
//          }
//          setIsLoading(false);
//       }, 1000);
//    };

//    interface DemoUser {
//       username: string;
//       password: string;
//    }

//    const handleQuickLogin = (role: string): void => {
//       const demoUser: DemoUser =
//          role === 'student'
//             ? { username: 'student1', password: 'student123' }
//             : { username: 'teacher1', password: 'teacher123' };

//       setSelectedRole(role);
//       setUsername(demoUser.username);
//       setPassword(demoUser.password);
//    };

//    return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
//          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
//             <div className="text-center mb-8">
//                <h1 className="text-3xl font-bold text-gray-800 mb-2">OHA</h1>
//                <p className="text-gray-600">Choose your role to continue</p>
//             </div>

//             {/* Role Selection */}
//             <div className="grid grid-cols-2 gap-4 mb-6">
//                <button
//                   onClick={() => setSelectedRole('student')}
//                   className={`p-4 rounded-lg border-2 transition-all ${
//                      selectedRole === 'student'
//                         ? 'border-blue-500 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 hover:border-blue-300'
//                   }`}
//                >
//                   <GraduationCap className="w-8 h-8 mx-auto mb-2" />
//                   <div className="font-semibold">Student</div>
//                </button>

//                <button
//                   onClick={() => setSelectedRole('teacher')}
//                   className={`p-4 rounded-lg border-2 transition-all ${
//                      selectedRole === 'teacher'
//                         ? 'border-green-500 bg-green-50 text-green-700'
//                         : 'border-gray-200 hover:border-green-300'
//                   }`}
//                >
//                   <User className="w-8 h-8 mx-auto mb-2" />
//                   <div className="font-semibold">Teacher</div>
//                </button>
//             </div>

//             {/* Login Form */}
//             <div className="space-y-4">
//                <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                      Username
//                   </label>
//                   <input
//                      type="text"
//                      value={username}
//                      onChange={(e) => setUsername(e.target.value)}
//                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                      placeholder="Enter your username"
//                   />
//                </div>

//                <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                      Password
//                   </label>
//                   <div className="relative">
//                      <input
//                         type={showPassword ? 'text' : 'password'}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
//                         placeholder="Enter your password"
//                         onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
//                      />
//                      <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                      >
//                         {showPassword ? (
//                            <EyeOff className="w-4 h-4" />
//                         ) : (
//                            <Eye className="w-4 h-4" />
//                         )}
//                      </button>
//                   </div>
//                </div>

//                {error && (
//                   <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
//                      {error}
//                   </div>
//                )}

//                <button
//                   onClick={handleLogin}
//                   disabled={!username || !password || isLoading}
//                   className={`w-full py-3 rounded-lg font-semibold transition-colors ${
//                      selectedRole === 'student'
//                         ? 'bg-blue-600 hover:bg-blue-700 text-white'
//                         : 'bg-green-600 hover:bg-green-700 text-white'
//                   } disabled:opacity-50 disabled:cursor-not-allowed`}
//                >
//                   {isLoading
//                      ? 'Logging in...'
//                      : `Login as ${
//                           selectedRole.charAt(0).toUpperCase() +
//                           selectedRole.slice(1)
//                        }`}
//                </button>
//             </div>

//             {/* Demo Credentials */}
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                <p className="text-sm text-gray-600 mb-3">Demo Credentials:</p>
//                <div className="space-y-2">
//                   <button
//                      onClick={() => handleQuickLogin('student')}
//                      className="w-full text-left text-xs bg-white p-2 rounded border hover:bg-blue-50"
//                   >
//                      <strong>Student:</strong> student1 / student123
//                   </button>
//                   <button
//                      onClick={() => handleQuickLogin('teacher')}
//                      className="w-full text-left text-xs bg-white p-2 rounded border hover:bg-green-50"
//                   >
//                      <strong>Teacher:</strong> teacher1 / teacher123
//                   </button>
//                </div>
//             </div>
//          </div>
//       </div>
//    );
// }

import React, { useState } from 'react';
import { GraduationCap, User, Eye, EyeOff } from 'lucide-react';
import { UserRole, Users } from '@/types';
import { mockUsers } from '@/data/data';

interface LoginPageProps {
   onLogin: (user: Users) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
   const [selectedRole, setSelectedRole] = useState<UserRole>('student');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const handleLogin = () => {
      setError('');
      setIsLoading(true);

      // Simulate API call delay
      setTimeout(() => {
         const user = mockUsers.find(
            (u) =>
               u.username === username &&
               u.password === password &&
               u.role === selectedRole
         );

         if (user) {
            onLogin({
               id: user.id,
               username: user.username,
               role: selectedRole,
            });
         } else {
            setError('Invalid credentials or wrong role selected');
         }
         setIsLoading(false);
      }, 1000);
   };

   const handleQuickLogin = (role: UserRole) => {
      const demoUser =
         role === 'student'
            ? { username: 'student1', password: 'student123' }
            : { username: 'teacher1', password: 'teacher123' };

      setSelectedRole(role);
      setUsername(demoUser.username);
      setPassword(demoUser.password);
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold text-gray-800 mb-2">OHA</h1>
               <p className="text-gray-600">Choose your role to continue</p>
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

            {/* Login Form */}
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
                  onClick={handleLogin}
                  disabled={!username || !password || isLoading}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                     selectedRole === 'student'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
               >
                  {isLoading
                     ? 'Logging in...'
                     : `Login as ${
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
                     <strong>Student:</strong> student1 / student123
                  </button>
                  <button
                     onClick={() => handleQuickLogin('teacher')}
                     className="w-full text-left text-xs bg-white p-2 rounded border hover:bg-green-50"
                  >
                     <strong>Teacher:</strong> teacher1 / teacher123
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
