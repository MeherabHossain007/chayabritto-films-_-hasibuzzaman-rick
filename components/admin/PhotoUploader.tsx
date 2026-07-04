'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, ImagePlus, FolderPlus, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface PhotoUploaderProps {
  categories: { name: string; slug: string }[];
  onUploadComplete?: () => void;
}

interface PreviewFile {
  file: File;
  preview: string;
}

export default function PhotoUploader({ categories, onUploadComplete }: PhotoUploaderProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [folderName, setFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setUploadStatus('idle');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.tiff', '.bmp'],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setUploadStatus('idle');
  };

  const handleUpload = async () => {
    if (!selectedCategory || files.length === 0) return;

    setUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('category', selectedCategory);
      if (folderName.trim()) {
        formData.append('folderName', folderName.trim());
      }
      files.forEach((f) => formData.append('files', f.file));

      // Simulate progress for UX (actual upload is single request)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + Math.random() * 15, 90));
      }, 500);

      const response = await fetch('/api/admin/photos', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      setUploadProgress(100);
      setUploadStatus('success');
      
      // Clear files after success
      setTimeout(() => {
        clearAll();
        setFolderName('');
        setUploadStatus('idle');
        onUploadComplete?.();
      }, 2000);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category & Folder Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-stone-400 uppercase tracking-[0.15em] mb-2">
            Category *
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-stone-800/60 border border-stone-700/50 rounded-xl px-4 py-3
              text-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 
              focus:border-primary-500/50 transition-all appearance-none
              cursor-pointer"
          >
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => setShowFolderInput(!showFolderInput)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${showFolderInput
                ? 'bg-primary-600/20 text-primary-400 border border-primary-700/50'
                : 'bg-stone-800/60 text-stone-400 border border-stone-700/50 hover:text-stone-200 hover:bg-stone-800'
              }`}
          >
            <FolderPlus size={16} />
            Drive Folder
          </button>
        </div>
      </div>

      {/* Folder Name Input */}
      {showFolderInput && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <label className="block text-xs font-medium text-stone-400 uppercase tracking-[0.15em] mb-2">
            Google Drive Folder Name (optional)
          </label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g., Rahim-Nusrat-Wedding-2026"
            className="w-full bg-stone-800/60 border border-stone-700/50 rounded-xl px-4 py-3
              text-stone-200 text-sm placeholder:text-stone-600 
              focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
          />
          <p className="text-stone-600 text-xs mt-1.5">
            Creates a sub-folder inside the category folder in Google Drive
          </p>
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragActive
            ? 'border-primary-500 bg-primary-500/10 scale-[1.01]'
            : 'border-stone-700/50 bg-stone-800/30 hover:border-stone-600 hover:bg-stone-800/50'
          }
          ${files.length > 0 ? 'py-8' : 'py-16'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center px-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all
            ${isDragActive 
              ? 'bg-primary-500/20 text-primary-400 scale-110' 
              : 'bg-stone-800 text-stone-500'}`}
          >
            <ImagePlus size={28} />
          </div>
          <p className="text-stone-300 text-sm font-medium mb-1">
            {isDragActive ? 'Drop your photos here...' : 'Drag & drop photos here'}
          </p>
          <p className="text-stone-600 text-xs">
            or click to browse • JPG, PNG, WebP, GIF
          </p>
        </div>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-stone-400 text-sm">
              <span className="text-stone-200 font-semibold">{files.length}</span> file{files.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={clearAll}
              className="text-stone-500 text-xs hover:text-red-400 transition-colors uppercase tracking-wider font-medium"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden group bg-stone-800"
              >
                <Image
                  src={file.preview}
                  alt={file.file.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/60 transition-all flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 
                      flex items-center justify-center text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950/80 to-transparent p-2">
                  <p className="text-stone-300 text-[10px] truncate">{file.file.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadStatus === 'uploading' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Uploading to Google Drive...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadStatus === 'success' && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-800/30 text-emerald-400 text-sm">
          <CheckCircle2 size={18} />
          <span>Photos uploaded successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {uploadStatus === 'error' && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-800/30 text-red-400 text-sm">
          <X size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0 || !selectedCategory}
        className={`w-full py-4 rounded-xl font-medium text-sm tracking-wide uppercase transition-all
          flex items-center justify-center gap-3
          ${uploading || files.length === 0 || !selectedCategory
            ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-900/30 hover:shadow-primary-900/50'
          }`}
      >
        {uploading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Upload size={18} />
        )}
        {uploading ? 'Uploading...' : `Upload ${files.length || ''} Photo${files.length !== 1 ? 's' : ''}`}
      </button>
    </div>
  );
}
