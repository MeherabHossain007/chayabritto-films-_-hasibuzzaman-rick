'use client';

import { useState } from 'react';
import { Trash2, ExternalLink, Check } from 'lucide-react';
import Image from 'next/image';

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

interface PhotoGridProps {
  photos: Photo[];
  onDelete?: (ids: string[]) => void;
  loading?: boolean;
}

export default function PhotoGrid({ photos, onDelete, loading }: PhotoGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === photos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(photos.map((p) => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    const confirmed = window.confirm(
      `Delete ${selectedIds.size} photo${selectedIds.size !== 1 ? 's' : ''}? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        fetch(`/api/admin/photos/${id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
      setSelectedIds(new Set());
      onDelete?.(Array.from(selectedIds));
    } catch (error) {
      console.error('Error deleting photos:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-stone-800/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-stone-800/60 flex items-center justify-center mb-4">
          <Image
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E"
            alt="No photos"
            width={32}
            height={32}
          />
        </div>
        <p className="text-stone-400 text-sm font-medium mb-1">No photos yet</p>
        <p className="text-stone-600 text-xs">Upload some photos to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary-600/10 border border-primary-800/30 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors uppercase tracking-wider font-medium"
            >
              {selectedIds.size === photos.length ? 'Deselect all' : 'Select all'}
            </button>
            <span className="text-stone-500 text-xs">
              {selectedIds.size} selected
            </span>
          </div>
          <button
            onClick={handleBulkDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 
              hover:bg-red-500/30 text-xs font-medium uppercase tracking-wider transition-all
              disabled:opacity-50"
          >
            <Trash2 size={14} />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo) => {
          const isSelected = selectedIds.has(photo.id);

          return (
            <div
              key={photo.id}
              className={`relative aspect-square rounded-xl overflow-hidden group cursor-pointer
                bg-stone-800 transition-all duration-200
                ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-stone-950 scale-[0.97]' : 'hover:scale-[1.02]'}
              `}
              onClick={() => toggleSelect(photo.id)}
            >
              <Image
                src={photo.thumbnailLink || photo.webContentLink}
                alt={photo.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />

              {/* Selection checkbox */}
              <div className={`absolute top-2 left-2 w-6 h-6 rounded-lg border-2 flex items-center justify-center
                transition-all z-10
                ${isSelected
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-white/50 bg-stone-950/30 opacity-0 group-hover:opacity-100'
                }`}
              >
                {isSelected && <Check size={14} className="text-white" />}
              </div>

              {/* Hover overlay */}
              <div className={`absolute inset-0 transition-all duration-300
                ${isSelected ? 'bg-primary-950/20' : 'bg-stone-950/0 group-hover:bg-stone-950/40'}`}
              >
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950/90 to-transparent p-3 
                  translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-stone-200 text-xs font-medium truncate">{photo.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary-400 text-[10px] uppercase tracking-wider font-medium">
                      {photo.categoryName}
                    </span>
                    <a
                      href={photo.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-stone-400 hover:text-white transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
