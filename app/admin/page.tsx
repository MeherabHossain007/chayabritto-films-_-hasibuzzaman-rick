'use client';

import { useState, useEffect } from 'react';
import { Images, FolderOpen, Upload, HardDrive, Camera } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import StatsCard from '@/components/admin/StatsCard';

interface CategoryStat {
  name: string;
  slug: string;
  photoCount: number;
}

interface Photo {
  id: string;
  title: string;
  thumbnailLink: string;
  categoryName: string;
  uploadedAt: string;
}

export default function AdminDashboard() {
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, photoRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/photos'),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }

        if (photoRes.ok) {
          const photoData = await photoRes.json();
          setRecentPhotos((photoData.photos || []).slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPhotos = categories.reduce((sum, cat) => sum + cat.photoCount, 0);
  const totalCategories = categories.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif text-stone-100 mb-1">Dashboard</h1>
        <p className="text-stone-500 text-sm">Welcome back to Chayabritto Films admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Photos"
          value={loading ? '—' : totalPhotos}
          icon={Images}
          gradient="primary"
        />
        <StatsCard
          title="Categories"
          value={loading ? '—' : totalCategories}
          icon={FolderOpen}
          gradient="blue"
        />
        <StatsCard
          title="Recent Uploads"
          value={loading ? '—' : recentPhotos.length}
          icon={Upload}
          gradient="emerald"
          trend="Last 24h"
        />
        <StatsCard
          title="Storage"
          value="Google Drive"
          icon={HardDrive}
          gradient="violet"
          trend="Cloud hosted"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/upload"
          className="group flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-primary-600/10 to-primary-700/5
            border border-primary-800/30 hover:border-primary-700/50 transition-all hover:scale-[1.01]"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 
            flex items-center justify-center shadow-lg shadow-primary-900/40">
            <Upload size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-stone-200 font-medium text-sm">Upload Photos</h3>
            <p className="text-stone-500 text-xs mt-0.5">Drag & drop to upload to Google Drive</p>
          </div>
        </Link>
        <Link
          href="/admin/categories"
          className="group flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-blue-700/5
            border border-blue-800/30 hover:border-blue-700/50 transition-all hover:scale-[1.01]"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 
            flex items-center justify-center shadow-lg shadow-blue-900/40">
            <FolderOpen size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-stone-200 font-medium text-sm">Manage Categories</h3>
            <p className="text-stone-500 text-xs mt-0.5">Create and organize categories</p>
          </div>
        </Link>
      </div>

      {/* Categories Breakdown */}
      {categories.length > 0 && (
        <div className="bg-stone-900/40 border border-stone-800/50 rounded-2xl p-6">
          <h2 className="text-stone-200 font-medium text-sm uppercase tracking-[0.15em] mb-4">
            Photos by Category
          </h2>
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.slug} className="flex items-center gap-4">
                <span className="text-stone-400 text-sm w-32 truncate">{cat.name}</span>
                <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                    style={{
                      width: totalPhotos > 0 ? `${(cat.photoCount / totalPhotos) * 100}%` : '0%',
                    }}
                  />
                </div>
                <span className="text-stone-500 text-xs w-12 text-right">{cat.photoCount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Photos */}
      {recentPhotos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-stone-200 font-medium text-sm uppercase tracking-[0.15em]">
              Recent Uploads
            </h2>
            <Link href="/admin/photos" className="text-primary-400 text-xs hover:text-primary-300 transition-colors uppercase tracking-wider font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recentPhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group bg-stone-800">
                <Image
                  src={photo.thumbnailLink}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-stone-200 text-xs truncate">{photo.title}</p>
                    <p className="text-primary-400 text-[10px] uppercase tracking-wider mt-0.5">
                      {photo.categoryName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && totalPhotos === 0 && (
        <div className="text-center py-16 bg-stone-900/40 border border-stone-800/50 rounded-2xl">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-stone-800/60 flex items-center justify-center mb-4">
            <Camera size={32} className="text-stone-600" />
          </div>
          <h3 className="text-stone-300 font-medium mb-2">No photos uploaded yet</h3>
          <p className="text-stone-600 text-sm mb-6">Get started by seeding categories and uploading your first photos</p>
          <div className="flex items-center justify-center gap-3">
            <SeedButton />
            <Link
              href="/admin/upload"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 
                text-white text-sm font-medium tracking-wide hover:from-primary-500 hover:to-primary-400 
                transition-all shadow-lg shadow-primary-900/30"
            >
              Upload Photos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function SeedButton() {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await fetch('/api/admin/seed', { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Error seeding:', error);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={seeding}
      className="px-6 py-2.5 rounded-xl border border-stone-700 text-stone-300 text-sm font-medium 
        tracking-wide hover:bg-stone-800 transition-all disabled:opacity-50"
    >
      {seeding ? 'Seeding...' : 'Seed Categories'}
    </button>
  );
}
