'use client';

import { useState, useEffect } from 'react';
import PhotoUploader from '@/components/admin/PhotoUploader';
import { toast } from 'sonner';

interface Category {
  name: string;
  slug: string;
}

export default function UploadPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleUploadComplete = () => {
    toast.success('Photos uploaded successfully!', {
      description: 'Files have been saved to Google Drive and indexed in the database.',
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif text-stone-100 mb-1">Upload Photos</h1>
        <p className="text-stone-500 text-sm">
          Upload photos to Google Drive and organize them by category
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-stone-900/40 border border-stone-800/50 rounded-2xl p-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-400 text-sm mb-4">No categories found. Seed default categories first.</p>
            <SeedButton onComplete={fetchCategories} />
          </div>
        ) : (
          <PhotoUploader categories={categories} onUploadComplete={handleUploadComplete} />
        )}
      </div>

      {/* Info Card */}
      <div className="bg-stone-900/20 border border-stone-800/30 rounded-2xl p-6">
        <h3 className="text-stone-300 text-sm font-medium mb-3">How it works</h3>
        <ul className="space-y-2.5 text-stone-500 text-xs">
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">1</span>
            <span>Select a category for your photos</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">2</span>
            <span>Optionally create a Google Drive sub-folder (e.g., &quot;Rahim-Wedding-2026&quot;)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">3</span>
            <span>Drag and drop your photos or click to browse</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">4</span>
            <span>Photos are uploaded and organized dynamically in your Google Drive folders</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function SeedButton({ onComplete }: { onComplete: () => void }) {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        toast.success('Categories seeded successfully!');
        onComplete();
      }
    } catch (error) {
      console.error('Error seeding:', error);
      toast.error('Failed to seed categories');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={seeding}
      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 
        text-white text-sm font-medium tracking-wide hover:from-primary-500 hover:to-primary-400 
        transition-all shadow-lg shadow-primary-900/30 disabled:opacity-50"
    >
      {seeding ? 'Seeding...' : 'Seed Default Categories'}
    </button>
  );
}
