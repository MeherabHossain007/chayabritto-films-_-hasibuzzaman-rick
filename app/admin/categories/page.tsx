'use client';

import { useState, useEffect } from 'react';
import { FolderPlus, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  name: string;
  slug: string;
  driveFolderId: string;
  driveWebLink: string;
  createdAt: string;
  photoCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [creating, setCreating] = useState(false);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create category');
      }

      toast.success(`Category "${newCategory.trim()}" created!`, {
        description: 'A matching folder was created in Google Drive.',
      });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  const handleSeed = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to seed categories');
    } finally {
      setCreating(false);
    }
  };

  const totalPhotos = categories.reduce((sum, cat) => sum + cat.photoCount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-stone-100 mb-1">Categories</h1>
          <p className="text-stone-500 text-sm">
            {categories.length} categories • {totalPhotos} total photos
          </p>
        </div>
        <button
          onClick={handleSeed}
          disabled={creating}
          className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 border border-stone-700/50
            hover:bg-stone-800 hover:text-stone-200 transition-all uppercase tracking-wider disabled:opacity-50"
        >
          Seed Defaults
        </button>
      </div>

      {/* Create New Category */}
      <div className="bg-stone-900/40 border border-stone-800/50 rounded-2xl p-6">
        <h2 className="text-stone-200 font-medium text-sm uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
          <FolderPlus size={16} className="text-primary-400" />
          Create New Category
        </h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name..."
            className="flex-1 bg-stone-800/60 border border-stone-700/50 rounded-xl px-4 py-3
              text-stone-200 text-sm placeholder:text-stone-600 
              focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={creating || !newCategory.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white 
              text-sm font-medium tracking-wide hover:from-primary-500 hover:to-primary-400 
              transition-all shadow-lg shadow-primary-900/30 disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <FolderPlus size={16} />}
            Create
          </button>
        </form>
        <p className="text-stone-600 text-xs mt-2">
          A matching folder will be created in Google Drive automatically
        </p>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-stone-800/40 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-stone-900/40 border border-stone-800/50 rounded-2xl">
          <p className="text-stone-400 text-sm mb-4">No categories yet</p>
          <p className="text-stone-600 text-xs">Create a category above or seed the defaults</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.slug}
              className="group flex items-center justify-between p-5 rounded-2xl 
                bg-stone-900/40 border border-stone-800/50 hover:border-stone-700/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600/20 to-primary-700/10 
                  border border-primary-800/30 flex items-center justify-center">
                  <span className="text-primary-400 text-lg font-serif font-bold">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-stone-200 font-medium text-sm">{category.name}</h3>
                  <p className="text-stone-600 text-xs mt-0.5">
                    {category.photoCount} photo{category.photoCount !== 1 ? 's' : ''} • slug: {category.slug}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Photo count badge */}
                <span className="px-3 py-1 rounded-lg bg-stone-800 text-stone-400 text-xs font-medium">
                  {category.photoCount}
                </span>

                {/* Drive link */}
                {category.driveWebLink && (
                  <a
                    href={category.driveWebLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-stone-500 hover:text-primary-400 hover:bg-stone-800 transition-all"
                    title="Open in Google Drive"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
