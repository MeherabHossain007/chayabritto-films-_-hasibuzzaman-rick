'use client';

import { useState, useEffect } from 'react';
import { 
  FolderOpen, Link as LinkIcon, ExternalLink, Loader2, Copy, 
  Check, Calendar, ImageIcon, ShieldAlert, Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Gallery {
  id: string;
  name: string;
  categoryName: string;
  categorySlug: string;
  photoCount: number;
  webViewLink: string;
  createdAt: string;
  isCategory?: boolean;
}

export default function AdminGalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchGalleries = async () => {
    try {
      const res = await fetch('/api/admin/galleries');
      if (res.ok) {
        const data = await res.json();
        setGalleries(data.galleries || []);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      toast.error('Failed to load galleries list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleCopyLink = (gallery: Gallery) => {
    const origin = window.location.origin;
    const clientLink = `${origin}/gallery/${gallery.id}`;
    
    navigator.clipboard.writeText(clientLink);
    setCopiedId(gallery.id);
    toast.success('Gallery link copied to clipboard!', {
      description: clientLink,
    });

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-100 mb-1">Customer Galleries</h1>
          <p className="text-stone-500 text-sm">
            Generate and copy clean shared access links for your customers
          </p>
        </div>
      </div>

      {/* Galleries List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-stone-900/40 border border-stone-850/50 animate-pulse" />
          ))}
        </div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-20 bg-stone-900/40 border border-stone-800/50 rounded-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-stone-800/60 flex items-center justify-center mb-4 text-stone-500">
            <FolderOpen size={24} />
          </div>
          <h3 className="text-stone-300 font-medium mb-1">No customer galleries found</h3>
          <p className="text-stone-600 text-sm mb-6 max-w-sm mx-auto">
            Create subfolders under categories when uploading photos (e.g. &quot;Rahim-Wedding&quot;) to create a client gallery.
          </p>
          <Link
            href="/admin/upload"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium tracking-wide hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-900/30"
          >
            Create Gallery & Upload
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className={`group flex flex-col md:flex-row md:items-center md:justify-between p-5 rounded-2xl border transition-all gap-4
                ${gallery.isCategory 
                  ? 'bg-blue-950/10 border-blue-900/30 hover:border-blue-800/40' 
                  : 'bg-stone-900/40 border-stone-800/50 hover:border-stone-750'
                }`}
            >
              {/* Left Section: Info */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0
                  ${gallery.isCategory
                    ? 'bg-gradient-to-br from-blue-600/10 to-blue-750/5 border-blue-800/30'
                    : 'bg-gradient-to-br from-primary-600/10 to-primary-700/5 border-primary-800/30'
                  }`}
                >
                  <FolderOpen size={20} className={gallery.isCategory ? 'text-blue-400' : 'text-primary-400'} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-stone-200 font-medium text-sm">{gallery.name}</h3>
                    {gallery.isCategory && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase tracking-wider">
                        Category Gallery
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-stone-500 text-xs">
                    <span className={`px-2 py-0.5 rounded font-medium uppercase tracking-wider text-[10px]
                      ${gallery.isCategory
                        ? 'bg-blue-950/40 text-blue-400/80'
                        : 'bg-stone-800/80 text-primary-400/80'
                      }`}
                    >
                      {gallery.categoryName}
                    </span>
                    <span className="flex items-center gap-1">
                      <ImageIcon size={12} />
                      {gallery.photoCount} photo{gallery.photoCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(gallery.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section: Actions */}
              <div className="flex items-center gap-3 md:self-center">
                {/* Copy client link */}
                <button
                  onClick={() => handleCopyLink(gallery)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all
                    ${copiedId === gallery.id
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-800/40'
                      : 'bg-stone-800 text-stone-300 border border-stone-700/50 hover:bg-stone-750'
                    }`}
                >
                  {copiedId === gallery.id ? <Check size={12} /> : <Copy size={12} />}
                  {copiedId === gallery.id ? 'Copied' : 'Copy Client Link'}
                </button>

                {/* View Gallery Link */}
                <Link
                  href={`/gallery/${gallery.id}`}
                  target="_blank"
                  className="p-2.5 rounded-xl bg-stone-800 border border-stone-700/50 text-stone-400 hover:text-stone-200 hover:bg-stone-750 transition-all"
                  title="View Public Gallery"
                >
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Warning Tip */}
      <div className="bg-stone-900/15 border border-stone-850 rounded-2xl p-5 flex items-start gap-4">
        <ShieldAlert size={20} className="text-stone-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <h4 className="text-stone-300 text-xs font-medium">Shared Gallery Security</h4>
          <p className="text-stone-500 text-[11px] leading-relaxed">
            The shared galleries page is public and does not require an admin password, allowing your clients to view and download their pictures directly. Anyone with the URL can view it, so please keep the generated links confidential.
          </p>
        </div>
      </div>
    </div>
  );
}
