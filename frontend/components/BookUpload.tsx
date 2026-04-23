'use client';

import { useState, useRef } from 'react';
import { bookApi } from '../lib/api';
import { Book } from '../types';

interface BookUploadProps {
  onUploadSuccess: (book: Book) => void;
}

export default function BookUpload({ onUploadSuccess }: BookUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File, title?: string) => {
    // Validate file
    const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, TXT, or DOCX files.');
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 50MB.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress('Uploading file...');

    try {
      setProgress('Processing document...');
      const response = await bookApi.upload(file, title);
      
      if (response.success && response.book) {
        setProgress('Book uploaded successfully!');
        onUploadSuccess(response.book);
        
        // Reset after success
        setTimeout(() => {
          setProgress('');
          setUploading(false);
          setSelectedFile(null);
          setCustomTitle('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload book');
      setUploading(false);
      setProgress('');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCustomTitle(file.name.replace(/\.[^/.]+$/, '')); // Set default title from filename
      setError(null);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      handleFileSelect(selectedFile, customTitle.trim() || undefined);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCustomTitle(file.name.replace(/\.[^/.]+$/, ''));
      setError(null);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`border border-gray-300 p-12 text-center transition-elegant ${
          dragActive
            ? 'border-gray-900 bg-gray-50'
            : 'hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={handleFileInput}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        
        <label
          htmlFor="file-upload"
          className="cursor-pointer block"
        >
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              strokeWidth="1"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="space-y-1">
              <p className="text-sm text-gray-900">
                <span className="hover:text-gray-600 transition-elegant">
                  Click to upload
                </span>
                {' '}or drag and drop
              </p>
              <p className="text-xs text-gray-500 tracking-wide">
                PDF, TXT, or DOCX (max 50MB)
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Show title input and upload button when file is selected */}
      {selectedFile && !uploading && (
        <div className="border border-gray-300 bg-white p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2 tracking-wide">
              Book Title
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter book title"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-elegant text-gray-900"
              disabled={uploading}
            />
            <p className="text-xs text-gray-500 mt-2 tracking-wide">
              Leave empty to use filename: {selectedFile.name.replace(/\.[^/.]+$/, '')}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-gray-900 text-white px-6 py-3 hover:bg-gray-700 transition-elegant disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              Upload Book
            </button>
            <button
              onClick={() => {
                setSelectedFile(null);
                setCustomTitle('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={uploading}
              className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-elegant disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {progress && (
        <div className="border border-gray-300 bg-gray-50 text-gray-900 px-6 py-4 text-sm flex items-center">
          {uploading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b border-gray-900 mr-3"></div>
          )}
          <span>{progress}</span>
        </div>
      )}

      {error && (
        <div className="border border-red-300 bg-red-50 text-red-800 px-6 py-4 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

// Made with Bob - Version 3
