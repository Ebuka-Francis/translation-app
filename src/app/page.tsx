'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import LoginPage from '@/components/login/LoginPage';
import TranslationInterface from '@/components/igboTranslator/IgboTranslatorApp';
import VideoUploadSection from '@/components/videoSection/VideoUpload';
import VideoLibrary from '@/components/library/VideoLibrary';
import Footer from '@/components/footer/Footer';

import {
   HistoryItem,
   FavoriteItem,
   VideoItem,
   //  englishToIgbo,
   //  popularPhrases,
   Users,
} from '@/types';

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

   // Handle user logout
   const handleLogout = () => {
      setUser(null);
   };

   // Translation function
   // Translation function
   const handleTranslate = async () => {
      if (!englishText.trim()) return;

      setIsTranslating(true);

      try {
         const response = await fetch(
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

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const translateData = await response.json();

         // Extract the translation from the response
         // Adjust this based on your API response structure
         const translation =
            translateData.igboText ||
            translateData.result ||
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

         // Optionally show an error message to the user
         // You might want to add error state management here
      } finally {
         setIsTranslating(false);
      }
   };

   // Add to favorites function
   const handleAddToFavorites = () => {
      console.log(' i am here,');
      if (!englishText.trim() || !igboText.trim() || !user) return;

      const newFavorite: FavoriteItem = {
         id: Date.now(),
         english: englishText,
         igbo: igboText,
         timestamp: new Date().toISOString(),
         //  userId: user.id,
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
   const handleVideoUpload = (newVideo: VideoItem) => {
      const updatedVideos = [...videos, newVideo];
      setVideos(updatedVideos);
      localStorage.setItem('igbo-videos', JSON.stringify(updatedVideos));
   };

   const handleVideoDelete = (videoId: string) => {
      const updatedVideos = videos.filter(
         (video) => String(video.id) !== videoId
      );
      setVideos(updatedVideos);
      localStorage.setItem('igbo-videos', JSON.stringify(updatedVideos));
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
