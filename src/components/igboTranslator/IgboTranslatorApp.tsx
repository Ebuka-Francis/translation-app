'use client';
import React, { useState, useEffect } from 'react';
import {
   Volume2,
   Copy,
   Search,
   Star,
   BookOpen,
   User,
   GraduationCap,
   LogOut,
   Eye,
   EyeOff,
   Upload,
   Play,
   Trash2,
   Video,
} from 'lucide-react';
import VideoLibrary from '../library/VideoLibrary';

// Mock data for the dictionary (you'll need to import your actual data)
const englishToIgbo: TranslationDictionary = {
   hello: 'ndewo',
   'thank you': 'dalu',
   'good morning': 'ụtụtụ ọma',
   'how are you': 'kedu ka ị mere',
   goodbye: 'ka ọ dị',
   please: 'biko',
   yes: 'ee',
   no: 'mba',
   water: 'mmiri',
   food: 'nri',
   family: 'ezinụlọ',
   love: 'ịhụnanya',
};

// Type definitions
type TranslationDictionary = { [key: string]: string };
type UserRole = 'student' | 'teacher';

interface User {
   id: string;
   username: string;
   role: UserRole;
}

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

interface VideoItem {
   id: number;
   title: string;
   description: string;
   url: string;
   thumbnail: string;
   uploadedBy: string;
   uploadDate: string;
   category: string;
}

// Mock users (in real app, this would come from a backend)
const mockUsers = [
   {
      id: '1',
      username: 'student1',
      password: 'student123',
      role: 'student' as UserRole,
   },
   {
      id: '2',
      username: 'teacher1',
      password: 'teacher123',
      role: 'teacher' as UserRole,
   },
   {
      id: '3',
      username: 'john_student',
      password: 'password',
      role: 'student' as UserRole,
   },
   {
      id: '4',
      username: 'mary_teacher',
      password: 'password',
      role: 'teacher' as UserRole,
   },
];

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

// Login Component
function LoginPage({ onLogin }: { onLogin: (user: User) => void }) {
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
            onLogin({ id: user.id, username: user.username, role: user.role });
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

// Header Component
function Header({ user, onLogout }: { user: User; onLogout: () => void }) {
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

// Video Upload Component for Teachers
function VideoUploadSection({
   user,
   videos,
   onVideoUpload,
   onVideoDelete,
}: {
   user: User;
   videos: VideoItem[];
   onVideoUpload: (video: VideoItem) => void;
   onVideoDelete: (id: number) => void;
}) {
   const [isUploading, setIsUploading] = useState(false);
   const [showUploadForm, setShowUploadForm] = useState(false);
   const [videoTitle, setVideoTitle] = useState('');
   const [videoDescription, setVideoDescription] = useState('');
   const [videoCategory, setVideoCategory] = useState('lesson');
   const [videoFile, setVideoFile] = useState<File | null>(null);
   const [videoUrl, setVideoUrl] = useState('');
   const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('url');

   const categories = [
      { value: 'lesson', label: 'Lesson' },
      { value: 'pronunciation', label: 'Pronunciation' },
      { value: 'culture', label: 'Culture' },
      { value: 'grammar', label: 'Grammar' },
      { value: 'vocabulary', label: 'Vocabulary' },
      { value: 'conversation', label: 'Conversation' },
   ];

   const handleVideoUpload = () => {
      if (!videoTitle.trim()) {
         alert('Please enter a video title');
         return;
      }

      if (uploadMethod === 'url' && !videoUrl.trim()) {
         alert('Please enter a video URL');
         return;
      }

      if (uploadMethod === 'file' && !videoFile) {
         alert('Please select a video file');
         return;
      }

      setIsUploading(true);

      // Simulate upload process
      setTimeout(() => {
         const newVideo: VideoItem = {
            id: Date.now(),
            title: videoTitle,
            description: videoDescription,
            url:
               uploadMethod === 'url'
                  ? videoUrl
                  : URL.createObjectURL(videoFile!),
            thumbnail: '/api/placeholder/320/180', // Placeholder thumbnail
            uploadedBy: user.username,
            uploadDate: new Date().toLocaleDateString(),
            category: videoCategory,
         };

         onVideoUpload(newVideo);

         // Reset form
         setVideoTitle('');
         setVideoDescription('');
         setVideoUrl('');
         setVideoFile(null);
         setVideoCategory('lesson');
         setShowUploadForm(false);
         setIsUploading(false);
      }, 2000);
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         // Check if file is a video
         if (file.type.startsWith('video/')) {
            setVideoFile(file);
         } else {
            alert('Please select a valid video file');
            e.target.value = '';
         }
      }
   };

   return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
               <Video className="w-5 h-5" />
               Video Library Management
            </h3>
            <button
               onClick={() => setShowUploadForm(!showUploadForm)}
               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
               <Upload className="w-4 h-4" />
               Upload Video
            </button>
         </div>

         {/* Upload Form */}
         {showUploadForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
               <h4 className="text-lg font-semibold mb-4">Upload New Video</h4>

               {/* Upload Method Selection */}
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                     onClick={() => setUploadMethod('url')}
                     className={`p-3 rounded-lg border-2 transition-all ${
                        uploadMethod === 'url'
                           ? 'border-green-500 bg-green-50 text-green-700'
                           : 'border-gray-200 hover:border-green-300'
                     }`}
                  >
                     <div className="font-medium">Video URL</div>
                     <div className="text-sm text-gray-600">
                        YouTube, Vimeo, etc.
                     </div>
                  </button>

                  <button
                     onClick={() => setUploadMethod('file')}
                     className={`p-3 rounded-lg border-2 transition-all ${
                        uploadMethod === 'file'
                           ? 'border-green-500 bg-green-50 text-green-700'
                           : 'border-gray-200 hover:border-green-300'
                     }`}
                  >
                     <div className="font-medium">Upload File</div>
                     <div className="text-sm text-gray-600">MP4, MOV, AVI</div>
                  </button>
               </div>

               <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Title *
                     </label>
                     <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter video title"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                     </label>
                     <select
                        value={videoCategory}
                        onChange={(e) => setVideoCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     >
                        {categories.map((cat) => (
                           <option key={cat.value} value={cat.value}>
                              {cat.label}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>

               {uploadMethod === 'url' ? (
                  <div className="mb-4">
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video URL *
                     </label>
                     <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="https://www.youtube.com/watch?v=..."
                     />
                  </div>
               ) : (
                  <div className="mb-4">
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video File *
                     </label>
                     <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     />
                     {videoFile && (
                        <p className="text-sm text-gray-600 mt-2">
                           Selected: {videoFile.name} (
                           {(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                     )}
                  </div>
               )}

               <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Description
                  </label>
                  <textarea
                     value={videoDescription}
                     onChange={(e) => setVideoDescription(e.target.value)}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                     rows={3}
                     placeholder="Brief description of the video content"
                  />
               </div>

               <div className="flex gap-3">
                  <button
                     onClick={handleVideoUpload}
                     disabled={isUploading}
                     className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                  >
                     <Upload className="w-4 h-4" />
                     {isUploading ? 'Uploading...' : 'Upload Video'}
                  </button>

                  <button
                     onClick={() => setShowUploadForm(false)}
                     className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                     Cancel
                  </button>
               </div>
            </div>
         )}

         {/* Video List */}
         <div className="space-y-4">
            <h4 className="text-lg font-semibold">
               Uploaded Videos ({videos.length})
            </h4>

            {videos.length === 0 ? (
               <div className="text-center py-8 text-gray-500">
                  <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No videos uploaded yet</p>
                  <p className="text-sm">
                     Click <q>Upload Video</q> to add your first video
                  </p>
               </div>
            ) : (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                     <div key={video.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                           <Play className="w-8 h-8 text-gray-400" />
                        </div>

                        <h5 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                           {video.title}
                        </h5>

                        <div className="text-sm text-gray-600 mb-2">
                           <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              {
                                 categories.find(
                                    (c) => c.value === video.category
                                 )?.label
                              }
                           </span>
                        </div>

                        {video.description && (
                           <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {video.description}
                           </p>
                        )}

                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                           <span>By {video.uploadedBy}</span>
                           <span>{video.uploadDate}</span>
                        </div>

                        <div className="flex justify-between items-center">
                           <button
                              onClick={() => window.open(video.url, '_blank')}
                              className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm"
                           >
                              <Play className="w-3 h-3" />
                              Watch
                           </button>

                           <button
                              onClick={() => onVideoDelete(video.id)}
                              className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                           >
                              <Trash2 className="w-3 h-3" />
                              Delete
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
// TranslatorApp Component
function TranslatorApp({
   user,
   onLogout,
}: {
   user: User;
   onLogout: () => void;
}) {
   const [englishText, setEnglishText] = useState<string>('');
   const [igboText, setIgboText] = useState<string>('');
   const [isTranslating] = useState<boolean>(false);
   const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
   const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
   const [translationHistory, setTranslationHistory] = useState<HistoryItem[]>(
      []
   );
   const [videos, setVideos] = useState<VideoItem[]>([]);

   // Load user-specific data from localStorage
   useEffect(() => {
      const savedFavorites = JSON.parse(
         localStorage.getItem(`igbo-favorites-${user.id}`) || '[]'
      ) as FavoriteItem[];
      const savedHistory = JSON.parse(
         localStorage.getItem(`igbo-history-${user.id}`) || '[]'
      ) as HistoryItem[];
      const savedVideos = JSON.parse(
         localStorage.getItem('igbo-videos') || '[]'
      ) as VideoItem[];

      setFavorites(savedFavorites);
      setTranslationHistory(savedHistory);
      setVideos(savedVideos);
   }, [user.id]);

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
         const cleanWord = word.replace(/[^\w]/g, '');
         return englishToIgbo[cleanWord] || word;
      });

      const result = translatedWords.join(' ');

      if (result === text.toLowerCase()) {
         return `${text} (translation not found)`;
      }

      return result;
   };

   // Handle translation
   const handleTranslate = async (): Promise<void> => {
      try {
         const translateData = await fetch(
            'https://igbo-translator-backend.onrender.com/api/translate',
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  text: englishText,
               }),
            }
         );
         console.log('Translation API response:', translateData);
      } catch (error) {
         console.error('Translation API error:', error);
      }
      // if (!englishText.trim()) return;

      // setIsTranslating(true);

      // setTimeout(() => {
      //    const translation = translateText(englishText);
      //    setIgboText(translation);

      //    // Add to history
      //    const newHistoryItem: HistoryItem = {
      //       id: Date.now(),
      //       english: englishText,
      //       igbo: translation,
      //       timestamp: new Date().toLocaleString(),
      //    };

      //    const updatedHistory = [
      //       newHistoryItem,
      //       ...translationHistory.slice(0, 9),
      //    ];
      //    setTranslationHistory(updatedHistory);
      //    localStorage.setItem(
      //       `igbo-history-${user.id}`,
      //       JSON.stringify(updatedHistory)
      //    );

      //    setIsTranslating(false);
      // }, 500);
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
      localStorage.setItem(
         `igbo-favorites-${user.id}`,
         JSON.stringify(updatedFavorites)
      );
   };

   // Remove from favorites
   const removeFromFavorites = (id: number): void => {
      const updatedFavorites = favorites.filter((fav) => fav.id !== id);
      setFavorites(updatedFavorites);
      localStorage.setItem(
         `igbo-favorites-${user.id}`,
         JSON.stringify(updatedFavorites)
      );
   };

   // Copy to clipboard
   const copyToClipboard = (text: string): void => {
      navigator.clipboard.writeText(text);
   };

   // Video management functions
   const handleVideoUpload = (video: VideoItem) => {
      const updatedVideos = [...videos, video];
      setVideos(updatedVideos);
      localStorage.setItem('igbo-videos', JSON.stringify(updatedVideos));
   };

   const handleVideoDelete = (id: number) => {
      const updatedVideos = videos.filter((video) => video.id !== id);
      setVideos(updatedVideos);
      localStorage.setItem('igbo-videos', JSON.stringify(updatedVideos));
   };

   // Text-to-speech
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
            <Header user={user} onLogout={onLogout} />

            {/* Teacher Video Upload Section */}
            {user.role === 'teacher' && (
               <VideoUploadSection
                  user={user}
                  videos={videos}
                  onVideoUpload={handleVideoUpload}
                  onVideoDelete={handleVideoDelete}
               />
            )}

            {/* Student Video Library */}
            {user.role === 'student' && videos.length > 0 && (
               <VideoLibrary videos={videos} />
            )}

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
         </div>
      </div>
   );
}

// Main App Component
export default function IgboTranslatorApp() {
   const [user, setUser] = useState<User | null>(null);

   // Check for saved session on mount
   useEffect(() => {
      const savedUser = localStorage.getItem('igbo-translator-user');
      if (savedUser) {
         setUser(JSON.parse(savedUser));
      }
   }, []);

   const handleLogin = (loggedInUser: User) => {
      setUser(loggedInUser);
      localStorage.setItem(
         'igbo-translator-user',
         JSON.stringify(loggedInUser)
      );
   };

   const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('igbo-translator-user');
   };

   return (
      <>
         {!user ? (
            <LoginPage onLogin={handleLogin} />
         ) : (
            <TranslatorApp user={user} onLogout={handleLogout} />
         )}
      </>
   );
}
