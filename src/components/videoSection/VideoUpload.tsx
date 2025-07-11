import React, { useState } from 'react';
import { Video, Upload, Play, Trash2 } from 'lucide-react';

// Assuming these types are now imported from your central types.ts file
import { Users, VideoItem } from '@/types';

// Define video categories if not imported from types.ts
const videoCategories = [
   { value: 'lesson', label: 'Lesson' },
   { value: 'tutorial', label: 'Tutorial' },
   { value: 'presentation', label: 'Presentation' },
   { value: 'demo', label: 'Demo' },
   { value: 'other', label: 'Other' },
];

// Define the component props interface
interface VideoUploadSectionProps {
   user: Users; // Use the User type from your central types.ts
   videos: VideoItem[];
   // Changed onVideoUpload signature: it will now receive a complete VideoItem
   onVideoUpload: (videoData: VideoItem) => void;
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
         // Generate a unique ID for the new video
         const newVideoId = Date.now().toString(); // Simple ID generation

         const newVideo: VideoItem = {
            id: newVideoId,
            title: videoTitle,
            description: videoDescription,
            category: videoCategory,
            url:
               uploadMethod === 'url'
                  ? videoUrl
                  : videoFile
                  ? URL.createObjectURL(videoFile)
                  : '', // Use object URL for file preview
            thumbnail: '/api/placeholder/320/180', // Placeholder thumbnail
            uploadedBy: user.username, // Use user.username from the User type
            uploadDate: new Date().toLocaleDateString(), // Format for display
            // file: uploadMethod === 'file' ? videoFile : null, // Not typically stored in VideoItem state after upload
            // uploadMethod: uploadMethod, // Can be inferred from URL/file presence if needed later
         };

         // Call the onVideoUpload prop with the complete VideoItem
         await onVideoUpload(newVideo);

         // Reset form
         resetForm(); // Use the existing reset function
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
         if (!file.type.startsWith('video/')) {
            alert('Please select a valid video file');
            event.target.value = ''; // Clear input
            return;
         }

         const maxSize = 100 * 1024 * 1024; // 100MB
         if (file.size > maxSize) {
            alert('File size must be less than 100MB');
            event.target.value = ''; // Clear input
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
      setUploadMethod('url'); // Reset to default upload method
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
                        {videoCategories.map((cat) => (
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
                     onClick={resetForm}
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
                     Click &quot;Upload Video&quot; to add your first video
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
                                 videoCategories.find(
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
