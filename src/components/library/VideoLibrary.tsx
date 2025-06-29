import React, { useState } from 'react';
import { Play, Search, Filter, Video, Clock, User, Eye } from 'lucide-react';

// Type definitions (same as in your main app)
interface VideoItem {
   id: string;
   title: string;
   description: string;
   url: string;
   thumbnail: string;
   uploadedBy: string;
   uploadDate: string;
   category: string;
}

interface VideoLibraryProps {
   videos: VideoItem[];
}

const VideoLibrary: React.FC<VideoLibraryProps> = ({ videos }) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('all');
   const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

   const categories = [
      { value: 'all', label: 'All Videos' },
      { value: 'lesson', label: 'Lesson' },
      { value: 'pronunciation', label: 'Pronunciation' },
      { value: 'culture', label: 'Culture' },
      { value: 'grammar', label: 'Grammar' },
      { value: 'vocabulary', label: 'Vocabulary' },
      { value: 'conversation', label: 'Conversation' },
   ];

   // Filter videos based on search and category
   const filteredVideos = videos.filter((video) => {
      const matchesSearch =
         video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         video.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
         selectedCategory === 'all' || video.category === selectedCategory;

      return matchesSearch && matchesCategory;
   });

   const handleVideoClick = (video: VideoItem) => {
      setSelectedVideo(video);
   };

   const closeVideoPlayer = () => {
      setSelectedVideo(null);
   };

   // Function to extract video ID from various video URLs (simplified)
   const getVideoEmbedUrl = (url: string): string => {
      // YouTube URL handling
      if (url.includes('youtube.com/watch?v=')) {
         const videoId = url.split('v=')[1]?.split('&')[0];
         return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
         const videoId = url.split('youtu.be/')[1]?.split('?')[0];
         return `https://www.youtube.com/embed/${videoId}`;
      }

      // Vimeo URL handling
      if (url.includes('vimeo.com/')) {
         const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
         return `https://player.vimeo.com/video/${videoId}`;
      }

      // For direct video files or other URLs, return as is
      return url;
   };

   return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
               <Video className="w-5 h-5" />
               Video Library ({filteredVideos.length} videos)
            </h3>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
               {/* Search Input */}
               <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search videos..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  />
               </div>

               {/* Category Filter */}
               <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                     value={selectedCategory}
                     onChange={(e) => setSelectedCategory(e.target.value)}
                     className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                     {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                           {category.label}
                        </option>
                     ))}
                  </select>
               </div>
            </div>
         </div>

         {/* Video Grid */}
         {filteredVideos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
               <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
               <p className="text-lg font-medium">No videos found</p>
               <p className="text-sm">
                  {searchTerm || selectedCategory !== 'all'
                     ? 'Try adjusting your search or filter criteria'
                     : 'Videos will appear here when teachers upload them'}
               </p>
            </div>
         ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredVideos.map((video) => (
                  <div
                     key={video.id}
                     className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                     onClick={() => handleVideoClick(video)}
                  >
                     {/* Video Thumbnail */}
                     <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="bg-white/90 group-hover:bg-blue-600 group-hover:text-white rounded-full p-3 transition-all">
                              <Play className="w-6 h-6" />
                           </div>
                        </div>
                        {/* Placeholder for video thumbnail */}
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                           <Video className="w-8 h-8 text-gray-400" />
                        </div>
                     </div>

                     {/* Video Info */}
                     <div className="p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                           {video.title}
                        </h4>

                        {/* Category Badge */}
                        <div className="mb-2">
                           <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {
                                 categories.find(
                                    (c) => c.value === video.category
                                 )?.label
                              }
                           </span>
                        </div>

                        {/* Description */}
                        {video.description && (
                           <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {video.description}
                           </p>
                        )}

                        {/* Video Metadata */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                           <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{video.uploadedBy}</span>
                           </div>
                           <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{video.uploadDate}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Video Player Modal */}
         {selectedVideo && (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center p-6 border-b">
                     <h3 className="text-xl font-semibold text-gray-800">
                        {selectedVideo.title}
                     </h3>
                     <button
                        onClick={closeVideoPlayer}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                     >
                        ×
                     </button>
                  </div>

                  {/* Video Player */}
                  <div className="p-6">
                     <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                        {selectedVideo.url.includes('youtube.com') ||
                        selectedVideo.url.includes('youtu.be') ||
                        selectedVideo.url.includes('vimeo.com') ? (
                           <iframe
                              src={getVideoEmbedUrl(selectedVideo.url)}
                              className="w-full h-full"
                              allowFullScreen
                              title={selectedVideo.title}
                           />
                        ) : (
                           <video
                              controls
                              className="w-full h-full"
                              src={selectedVideo.url}
                           >
                              Your browser does not support the video tag.
                           </video>
                        )}
                     </div>

                     {/* Video Details */}
                     <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                           <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>By {selectedVideo.uploadedBy}</span>
                           </div>
                           <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{selectedVideo.uploadDate}</span>
                           </div>
                           <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {
                                 categories.find(
                                    (c) => c.value === selectedVideo.category
                                 )?.label
                              }
                           </span>
                        </div>

                        {selectedVideo.description && (
                           <div>
                              <h4 className="font-semibold text-gray-800 mb-2">
                                 Description
                              </h4>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                 {selectedVideo.description}
                              </p>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t bg-gray-50 rounded-b-xl">
                     <div className="flex justify-end gap-3">
                        <button
                           onClick={() =>
                              window.open(selectedVideo.url, '_blank')
                           }
                           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                        >
                           <Eye className="w-4 h-4" />
                           Open in New Tab
                        </button>
                        <button
                           onClick={closeVideoPlayer}
                           className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                           Close
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default VideoLibrary;
