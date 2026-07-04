'use client';

import { useState, useEffect, useCallback } from 'react';
import PhotoGrid from '@/components/admin/PhotoGrid';
import { toast } from 'sonner';

interface Category {
  name: string;
  slug: string;
}

interface Photo {
  id: string;
  title: string;
  driveFileId: string;
  webViewLink: string;
  webContentLink: string;
  thumbnailLink: string;
  categoryName: string;
  categorySlug: string;
  folderName?: string;
  uploadedAt?: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const categoryParam = activeCategory !== 'All' ? `?category=${activeCategory}` : '';
      const res = await fetch(`/api/admin/photos${categoryParam}`);
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleDelete = (ids: string[]) => {
    setPhotos((prev) => prev.filter((p) => !ids.includes(p.id)));
    toast.success(`Deleted ${ids.length} photo${ids.length !== 1 ? 's' : ''}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-100 mb-1">Photos</h1>
          <p className="text-stone-500 text-sm">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-all
            ${activeCategory === 'All'
              ? 'bg-primary-600/20 text-primary-400 border border-primary-700/50'
              : 'bg-stone-800/60 text-stone-500 border border-stone-700/50 hover:text-stone-300 hover:bg-stone-800'
            }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition-all
              ${activeCategory === cat.slug
                ? 'bg-primary-600/20 text-primary-400 border border-primary-700/50'
                : 'bg-stone-800/60 text-stone-500 border border-stone-700/50 hover:text-stone-300 hover:bg-stone-800'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <PhotoGrid photos={photos} onDelete={handleDelete} loading={loading} />
    </div>
  );
}
