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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
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
      const response = await bookApi.upload(file);
      
      if (response.success && response.book) {
        setProgress('Book uploaded successfully!');
        onUploadSuccess(response.book);
        
        // Reset after success
        setTimeout(() => {
          setProgress('');
          setUploading(false);
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
      handleFileSelect(file);
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
      handleFileSelect(file);
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
