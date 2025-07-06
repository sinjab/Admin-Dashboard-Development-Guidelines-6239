import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const { FiUpload, FiX, FiImage, FiFile } = FiIcons;

// Simple file upload without external dependencies
const FileUpload = ({ 
  onFileUploaded, 
  onError,
  accept = 'image/*', 
  directory = 'uploads',
  maxSize = 5 * 1024 * 1024, // 5MB
  optimize = true,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Simple mock upload function - replace with actual upload logic
  const uploadFile = async (file) => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock URL - in real implementation, this would be your upload service
    const mockUrl = `https://example.com/${directory}/${Date.now()}-${file.name}`;
    
    // For demo purposes, create a local URL
    const localUrl = URL.createObjectURL(file);
    
    return localUrl; // Return the local URL for demo
  };

  const optimizeImage = async (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file size
    if (file.size > maxSize) {
      const errorMessage = `File size must be less than ${maxSize / (1024 * 1024)}MB`;
      toast.error(errorMessage);
      if (onError) onError(new Error(errorMessage));
      return;
    }
    
    // Validate file type
    if (accept !== '*' && !file.type.match(accept.replace('*', '.*'))) {
      const errorMessage = `Invalid file type. Please select a ${accept} file.`;
      toast.error(errorMessage);
      if (onError) onError(new Error(errorMessage));
      return;
    }
    
    setUploading(true);
    
    try {
      let fileToUpload = file;
      
      // Optimize image if needed
      if (optimize && file.type.startsWith('image/')) {
        fileToUpload = await optimizeImage(file);
      }
      
      // Upload file
      const url = await uploadFile(fileToUpload);
      
      // Call success callback
      if (onFileUploaded) {
        onFileUploaded(url);
      }
      
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Failed to upload file';
      toast.error(errorMessage);
      if (onError) onError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
          ${dragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <SafeIcon 
              icon={accept.includes('image') ? FiImage : FiFile} 
              className="w-12 h-12 mx-auto text-gray-400" 
            />
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Click to upload
                </span>
                {' '}or drag and drop
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {accept.includes('image') ? 'PNG, JPG, JPEG up to' : 'Files up to'} {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FileUpload;