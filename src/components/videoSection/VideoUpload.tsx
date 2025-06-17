import React, { useState } from 'react';
import { Video, Upload, Play, Trash2 } from 'lucide-react';

// Define video categories if not imported
const videoCategories = [
   { value: 'lesson', label: 'Lesson' },
   { value: 'tutorial', label: 'Tutorial' },
   { value: 'presentation', label: 'Presentation' },
   { value: 'demo', label: 'Demo' },
   { value: 'other', label: 'Other' },
];

// Define the video item type
interface VideoItem {
   id: string;
   title: string;
   description: string;
   category: string;
   url?: string;
   file?: File | null;
   uploadMethod?: 'url' | 'file';
   createdAt: string;
   userId: string;
}

// Define the component props interface
interface VideoUploadSectionProps {
   user: { id: string; name: string; email: string };
   videos: VideoItem[];
   onVideoUpload: (videoData: Omit<VideoItem, 'id'>) => void;
   onVideoDelete: (videoId: string) => void;
}

export default function VideoUploadSection({
   user,
   videos,
   onVideoUpload,
   onVideoDelete,
}: VideoUploadSectionProps) {
   const [isUploading, setIsUploading] = useState(false);
   const [showUploadForm, setShowUploadForm] = useState(false);
   const [videoTitle, setVideoTitle] = useState('');
   const [videoDescription, setVideoDescription] = useState('');
   const [videoCategory, setVideoCategory] = useState('lesson');
   const [videoFile, setVideoFile] = useState<File | null>(null);
   const [videoUrl, setVideoUrl] = useState('');
   const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');

   const handleVideoUpload = async () => {
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

      try {
         const videoData: Omit<VideoItem, 'id'> = {
            title: videoTitle,
            description: videoDescription,
            category: videoCategory,
            url: uploadMethod === 'url' ? videoUrl : '',
            file: uploadMethod === 'file' ? videoFile : null,
            uploadMethod,
            createdAt: new Date().toISOString(),
            userId: user?.id || '',
         };

         await onVideoUpload(videoData);

         // Reset form
         setVideoTitle('');
         setVideoDescription('');
         setVideoCategory('lesson');
         setVideoFile(null);
         setVideoUrl('');
         setShowUploadForm(false);
      } catch (error) {
         console.error('Error uploading video:', error);
         alert('Failed to upload video. Please try again.');
      } finally {
         setIsUploading(false);
      }
   };

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         // Check file type
         if (!file.type.startsWith('video/')) {
            alert('Please select a valid video file');
            return;
         }

         // Check file size (e.g., max 100MB)
         const maxSize = 100 * 1024 * 1024; // 100MB in bytes
         if (file.size > maxSize) {
            alert('File size must be less than 100MB');
            return;
         }

         setVideoFile(file);
      }
   };

   const resetForm = () => {
      setShowUploadForm(false);
      setVideoTitle('');
      setVideoDescription('');
      setVideoCategory('lesson');
      setVideoFile(null);
      setVideoUrl('');
   };

   return (
      <div className="video-upload-section">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
               <Video className="w-6 h-6" />
               Video Library
            </h2>
            <button
               onClick={() => setShowUploadForm(!showUploadForm)}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
               <Upload className="w-4 h-4" />
               Upload Video
            </button>
         </div>

         {showUploadForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
               <h3 className="text-lg font-semibold mb-4">Upload New Video</h3>

               {/* Upload Method Selection */}
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     Upload Method
                  </label>
                  <div className="flex gap-4">
                     <label className="flex items-center">
                        <input
                           type="radio"
                           value="url"
                           checked={uploadMethod === 'url'}
                           onChange={(e) =>
                              setUploadMethod(e.target.value as 'url' | 'file')
                           }
                           className="mr-2"
                        />
                        URL
                     </label>
                     <label className="flex items-center">
                        <input
                           type="radio"
                           value="file"
                           checked={uploadMethod === 'file'}
                           onChange={(e) =>
                              setUploadMethod(e.target.value as 'url' | 'file')
                           }
                           className="mr-2"
                        />
                        File Upload
                     </label>
                  </div>
               </div>

               {/* Video Title */}
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     Title *
                  </label>
                  <input
                     type="text"
                     value={videoTitle}
                     onChange={(e) => setVideoTitle(e.target.value)}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Enter video title"
                  />
               </div>

               {/* Video Description */}
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     Description
                  </label>
                  <textarea
                     value={videoDescription}
                     onChange={(e) => setVideoDescription(e.target.value)}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     rows={3}
                     placeholder="Enter video description"
                  />
               </div>

               {/* Video Category */}
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     Category
                  </label>
                  <select
                     value={videoCategory}
                     onChange={(e) => setVideoCategory(e.target.value)}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                     {videoCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                           {category.label}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Conditional Input Based on Upload Method */}
               {uploadMethod === 'url' ? (
                  <div className="mb-4">
                     <label className="block text-sm font-medium mb-2">
                        Video URL *
                     </label>
                     <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/video.mp4"
                     />
                  </div>
               ) : (
                  <div className="mb-4">
                     <label className="block text-sm font-medium mb-2">
                        Video File *
                     </label>
                     <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                     {videoFile && (
                        <p className="text-sm text-gray-600 mt-2">
                           Selected: {videoFile.name} (
                           {Math.round(videoFile.size / 1024 / 1024)}MB)
                        </p>
                     )}
                  </div>
               )}

               {/* Action Buttons */}
               <div className="flex gap-3">
                  <button
                     onClick={handleVideoUpload}
                     disabled={isUploading}
                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isUploading ? 'Uploading...' : 'Upload Video'}
                  </button>
                  <button
                     onClick={resetForm}
                     className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                     Cancel
                  </button>
               </div>
            </div>
         )}

         {/* Video List */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.length === 0 ? (
               <div className="col-span-full text-center py-8 text-gray-500">
                  No videos uploaded yet. Click &quot;Upload Video&quot; to get
                  started.
               </div>
            ) : (
               videos.map((video) => (
                  <div
                     key={video.id}
                     className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                     <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-400" />
                     </div>
                     <div className="p-4">
                        <h4 className="font-semibold truncate">
                           {video.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                           {video.description || 'No description provided'}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                           <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {video.category}
                           </span>
                           <button
                              onClick={() => onVideoDelete(video.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete video"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}
