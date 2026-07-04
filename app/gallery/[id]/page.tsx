'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { 
  Download, Eye, Maximize2, X, ChevronLeft, ChevronRight, 
  Camera, ArrowDownToLine, CheckCircle2, Image as ImageIcon, Loader2
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface Photo {
  id: string;
  title: string;
  driveFileId: string;
  webViewLink: string;
  webContentLink: string;
  thumbnailLink: string;
  uploadedAt: string;
  size?: string;
}

interface GalleryData {
  name: string;
  id: string;
  createdTime: string;
  photos: Photo[];
}

export default function PublicGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<GalleryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`/api/gallery/${id}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to load gallery');
        }
        const galleryData = await res.json();
        setData(galleryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [id]);

  const handleDownload = (photo: Photo) => {
    // Open in a new tab which triggers automatic attachment download for Google Drive webContentLink
    window.open(photo.webContentLink, '_blank');
    toast.success('Download started');
  };

  const handleDownloadAll = async () => {
    if (!data || data.photos.length === 0) return;
    setDownloadingAll(true);
    toast.info(`Preparing download links for ${data.photos.length} photos...`);

    try {
      // Trigger downloads sequentially with a slight delay to prevent browser blockages
      for (let i = 0; i < data.photos.length; i++) {
        const photo = data.photos[i];
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = photo.webContentLink;
        document.body.appendChild(iframe);
        
        // Remove iframe after download trigger
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1500);
        
        // Delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      toast.success('All downloads initiated!');
    } catch {
      toast.error('Failed to trigger bulk download. Try downloading individually.');
    } finally {
      setDownloadingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-4 text-stone-300">
        <Loader2 size={32} className="text-primary-500 animate-spin" />
        <p className="text-sm font-medium tracking-wide">Loading client gallery...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-800/30 flex items-center justify-center mb-4 text-red-500">
          <X size={28} />
        </div>
        <h1 className="text-xl font-serif text-stone-200 mb-2">Access Denied</h1>
        <p className="text-stone-500 text-sm max-w-sm mb-6">
          {error || 'The requested gallery could not be found. Please check your shared link.'}
        </p>
      </div>
    );
  }

  const activePhoto = lightboxIndex !== null ? data.photos[lightboxIndex] : null;

  return (
    <>
      <Toaster theme="dark" position="top-right" />
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
        {/* Gallery Header */}
        <header className="border-b border-stone-900/60 bg-stone-950/80 backdrop-blur sticky top-0 z-30 px-6 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/30">
                <Camera size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-serif font-bold text-stone-100 tracking-wide">
                  {data.name}
                </h1>
                <p className="text-stone-500 text-xs mt-0.5">
                  Shared Client Gallery • {data.photos.length} Photos
                </p>
              </div>
            </div>
            
            {data.photos.length > 0 && (
              <button
                onClick={handleDownloadAll}
                disabled={downloadingAll}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium tracking-wide hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-900/30 disabled:opacity-50"
              >
                {downloadingAll ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowDownToLine size={16} />
                )}
                {downloadingAll ? 'Downloading...' : 'Download All'}
              </button>
            )}
          </div>
        </header>

        {/* Gallery Grid */}
        <main className="flex-1 max-w-7xl mx-auto p-6 md:p-8 w-full">
          {data.photos.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center justify-center border border-stone-900 bg-stone-900/10 rounded-3xl">
              <ImageIcon size={48} className="text-stone-700 mb-4" />
              <h2 className="text-stone-300 font-medium mb-1">No photos in this gallery</h2>
              <p className="text-stone-600 text-xs">Images will appear here once uploaded by the admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-900/40 border border-stone-900/80 cursor-zoom-in hover:border-stone-800 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <Image
                    src={photo.thumbnailLink}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  
                  {/* Photo Info / Actions Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    <p className="text-stone-200 text-xs font-medium truncate">{photo.title}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-850/50">
                      <span className="text-stone-500 text-[10px]">
                        {photo.size || 'Image'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIndex(index);
                          }}
                          className="p-2 rounded-lg bg-stone-900/80 text-stone-400 hover:text-white hover:bg-stone-850 transition-colors"
                          title="View fullscreen"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(photo);
                          }}
                          className="p-2 rounded-lg bg-stone-900/80 text-stone-400 hover:text-white hover:bg-stone-850 transition-colors"
                          title="Download photo"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-8 border-t border-stone-900/60 bg-stone-950 text-center text-stone-600 text-xs">
          <p>© {new Date().getFullYear()} Chayabritto Films. Shared safely using Google Drive.</p>
        </footer>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && activePhoto && (
          <div className="fixed inset-0 bg-stone-950/98 z-50 flex items-center justify-center select-none animate-fade-in">
            {/* Header / Actions */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between text-stone-300 bg-gradient-to-b from-stone-950 to-transparent">
              <span className="text-xs truncate font-medium max-w-[60%]">
                {activePhoto.title} ({lightboxIndex + 1} of {data.photos.length})
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(activePhoto)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-200 text-xs transition-colors"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 rounded-xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={() => setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : data.photos.length - 1))}
              className="absolute left-4 p-3 rounded-full bg-stone-900/60 border border-stone-800/40 text-stone-400 hover:text-white transition-colors z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setLightboxIndex(prev => (prev !== null && prev < data.photos.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 p-3 rounded-full bg-stone-900/60 border border-stone-800/40 text-stone-400 hover:text-white transition-colors z-10"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Preview */}
            <div className="relative w-[90%] h-[80%] max-w-5xl">
              <Image
                src={activePhoto.webContentLink}
                alt={activePhoto.title}
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
