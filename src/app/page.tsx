'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import LoginPage from '@/components/login/LoginPage';
import TranslationInterface from '@/components/igboTranslator/IgboTranslatorApp';
import VideoUploadSection from '@/components/videoSection/VideoUpload';
import VideoLibrary from '@/components/library/VideoLibrary';
import Footer from '@/components/footer/Footer';
import axios, { AxiosError } from 'axios';
import { config } from '@/components/api/api';

import { HistoryItem, FavoriteItem, VideoItem, Users } from '@/types';

// Import the translation data
import { englishToIgbo } from '../data/data';

export default function Page() {
   const [user, setUser] = useState<Users | null>(null);
   const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
   const [translationHistory, setTranslationHistory] = useState<HistoryItem[]>(
      []
   );
   const [videos, setVideos] = useState<VideoItem[]>([]);

   // Translation interface state
   const [englishText, setEnglishText] = useState<string>('');
   const [igboText, setIgboText] = useState<string>('');
   const [isTranslating, setIsTranslating] = useState<boolean>(false);

   // Check for existing user session on component mount
   useEffect(() => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
         try {
            // Set authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Validate token with backend instead of just trusting localStorage
            validateToken();
         } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
         }
      }
   }, []);

   useEffect(() => {
      if (user) {
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
      } else {
         setFavorites([]);
         setTranslationHistory([]);
      }
   }, [user]);

   // Handle user login
   const handleLogin = (loggedInUser: Users) => {
      setUser(loggedInUser);
   };

   // Handle user logout with backend API call
   const handleLogout = async () => {
      try {
         const token = localStorage.getItem('token');

         if (token) {
            // Call backend logout API to blacklist the token
            await axios.post(
               `${config.baseUrl}${config.endpoints.logout || '/auth/logout'}`,
               {},
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                     'Content-Type': 'application/json',
                  },
               }
            );
         }
      } catch (error) {
         console.error('Logout API error:', error);

         // Handle different types of errors
         if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 401) {
               // Token already invalid, continue with logout
               console.log('Token was already invalid');
            } else if (axiosError.response?.status === 500) {
               console.error('Server error during logout');
            }
         }

         // Continue with client-side logout even if API call fails
      } finally {
         // Always perform client-side cleanup
         setUser(null);
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         delete axios.defaults.headers.common['Authorization'];

         // Clear user-specific data
         setFavorites([]);
         setTranslationHistory([]);
         setVideos([]);

         // Reset translation interface
         setEnglishText('');
         setIgboText('');
         setIsTranslating(false);
      }
   };

   // Enhanced token validation function
   const validateToken = async () => {
      try {
         const token = localStorage.getItem('token');
         if (!token) {
            handleLogout();
            return false;
         }

         // Try to get user profile to validate token
         const response = await axios.get(
            `${config.baseUrl}${config.endpoints.getProfile || '/auth/me'}`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
            }
         );

         if (response.data && response.data.id) {
            // Token is valid, update user data if needed
            setUser(response.data);
            return true;
         } else {
            // Invalid response, logout
            handleLogout();
            return false;
         }
      } catch (error) {
         console.error('Token validation error:', error);

         if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 401) {
               // Token expired or invalid
               handleLogout();
               return false;
            }
         }

         // For other errors, don't logout automatically
         return false;
      }
   };

   // Setup axios interceptor for global error handling
   useEffect(() => {
      const interceptor = axios.interceptors.response.use(
         (response) => response,
         (error) => {
            if (error.response?.status === 401) {
               // Token expired or invalid, logout user
               handleLogout();
            }
            return Promise.reject(error);
         }
      );

      // Cleanup interceptor on unmount
      return () => axios.interceptors.response.eject(interceptor);
   }, []);

   // Periodic token validation (every 5 minutes)
   useEffect(() => {
      if (user) {
         const interval = setInterval(() => {
            validateToken();
         }, 5 * 60 * 1000); // 5 minutes

         return () => clearInterval(interval);
      }
   }, [user]);

   // Translation function using axios
   const handleTranslate = async () => {
      if (!englishText.trim()) return;

      setIsTranslating(true);

      try {
         const response = await axios.post(
            ` ${config.baseUrl}${config.endpoints.translateText} `,
            {
               text: englishText,
            }
         );

         // Extract the translation from the response
         const translation =
            response.data.igboText ||
            response.data.result ||
            response.data.translation ||
            'Translation not available';

         setIgboText(translation);

         // Add to history if user is logged in and translation is successful
         if (user && translation !== 'Translation not available') {
            const newHistoryItem: HistoryItem = {
               id: Date.now(),
               english: englishText,
               igbo: translation,
               timestamp: new Date().toISOString(),
            };

            const updatedHistory = [newHistoryItem, ...translationHistory];
            setTranslationHistory(updatedHistory);
            localStorage.setItem(
               `igbo-history-${user.id}`,
               JSON.stringify(updatedHistory)
            );
         }
      } catch (error) {
         console.error('Translation API error:', error);

         // Handle axios errors
         if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 401) {
               // Token expired, logout user
               handleLogout();
               return;
            }
         }

         // Fallback to local translation data if API fails
         let fallbackTranslation: string;
         const lowerKey = englishText.toLowerCase();

         if (lowerKey in englishToIgbo) {
            fallbackTranslation =
               englishToIgbo[lowerKey as keyof typeof englishToIgbo];
         } else if (englishText in englishToIgbo) {
            fallbackTranslation =
               englishToIgbo[englishText as keyof typeof englishToIgbo];
         } else {
            fallbackTranslation = 'Translation not found';
         }

         setIgboText(fallbackTranslation);

         // Add to history even with fallback translation if user is logged in
         if (user && fallbackTranslation !== 'Translation not found') {
            const newHistoryItem: HistoryItem = {
               id: Date.now(),
               english: englishText,
               igbo: fallbackTranslation,
               timestamp: new Date().toISOString(),
            };

            const updatedHistory = [newHistoryItem, ...translationHistory];
            setTranslationHistory(updatedHistory);
            localStorage.setItem(
               `igbo-history-${user.id}`,
               JSON.stringify(updatedHistory)
            );
         }
      } finally {
         setIsTranslating(false);
      }
   };

   // Add to favorites function
   const handleAddToFavorites = () => {
      if (!englishText.trim() || !igboText.trim() || !user) return;

      const newFavorite: FavoriteItem = {
         id: Date.now(),
         english: englishText,
         igbo: igboText,
         timestamp: new Date().toISOString(),
      };

      // Check if already in favorites
      const alreadyExists = favorites.some(
         (fav) => fav.english.toLowerCase() === englishText.toLowerCase()
      );

      if (!alreadyExists) {
         const updatedFavorites = [newFavorite, ...favorites];
         setFavorites(updatedFavorites);
         localStorage.setItem(
            `igbo-favorites-${user.id}`,
            JSON.stringify(updatedFavorites)
         );
      }
   };

   // Video management functions
   const handleVideoUpload = async (newVideo: VideoItem) => {
      try {
         // If you have a video upload API endpoint
         // const response = await axios.post('/api/videos', newVideo);
         // const savedVideo = response.data;

         // For now, using local storage
         const updatedVideos = [...videos, newVideo];
         setVideos(updatedVideos);
         localStorage.setItem('igbo-videos', JSON.stringify(updatedVideos));
      } catch (error) {
         console.error('Video upload error:', error);

         // Handle token expiration during video upload
         if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 401) {
               handleLogout();
               return;
            }
         }
      }
   };

   const handleVideoDelete = async (videoId: string) => {
      try {
         // If you have a video delete API endpoint
         // await axios.delete(`/api/videos/${videoId}`);

         // For now, using local storage
         const updatedVideos = videos.filter(
            (video) => String(video.id) !== videoId
         );
         setVideos(updatedVideos);
         localStorage.setItem('igbo-videos', JSON.stringify(updatedVideos));
      } catch (error) {
         console.error('Video delete error:', error);

         // Handle token expiration during video deletion
         if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 401) {
               handleLogout();
               return;
            }
         }
      }
   };

   // Render based on login state
   if (!user) {
      return <LoginPage onLogin={handleLogin} />;
   }

   // Render main application interface if logged in
   return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
         <div className="max-w-6xl mx-auto">
            {/* Header Component */}
            <Header user={user} onLogout={handleLogout} />

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
            <TranslationInterface
               englishText={englishText}
               setEnglishText={setEnglishText}
               igboText={igboText}
               setIgboText={setIgboText}
               onTranslate={handleTranslate}
               onAddToFavorites={handleAddToFavorites}
               isTranslating={isTranslating}
               favorites={favorites}
            />
         </div>
         <Footer />
      </div>
   );
}
