'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  HardDrive,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2,
  Unplug,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

interface DriveStatus {
  status: 'connected' | 'disconnected' | 'error';
  user?: {
    displayName: string;
    emailAddress: string;
    photoLink: string;
  };
  message?: string;
  error?: string;
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <Loader2 size={24} className="text-stone-500 animate-spin" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const [driveStatus, setDriveStatus] = useState<DriveStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const fetchDriveStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/drive-status');
      const data = await res.json();
      setDriveStatus(data);
    } catch {
      setDriveStatus({ status: 'error', error: 'Failed to check Drive status' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDriveStatus();
  }, [fetchDriveStatus]);

  // Handle OAuth callback params
  useEffect(() => {
    const connected = searchParams.get('drive_connected');
    const error = searchParams.get('drive_error');

    if (connected === 'true') {
      toast.success('Google Drive connected successfully!');
      fetchDriveStatus();
      // Clean URL
      window.history.replaceState({}, '', '/admin/settings');
    }

    if (error) {
      toast.error(`Google Drive error: ${error}`);
      window.history.replaceState({}, '', '/admin/settings');
    }
  }, [searchParams, fetchDriveStatus]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch('/api/admin/google/auth');
      const data = await res.json();

      if (data.connected) {
        toast.info('Google Drive is already connected.');
        fetchDriveStatus();
        return;
      }

      if (data.url) {
        // Redirect to Google OAuth consent page
        window.location.href = data.url;
      }
    } catch {
      toast.error('Failed to start Google authentication');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Disconnect Google Drive? Uploaded photos will still be accessible, but you won\'t be able to upload new ones until you reconnect.')) {
      return;
    }

    setDisconnecting(true);
    try {
      const res = await fetch('/api/admin/google/disconnect', { method: 'POST' });
      if (res.ok) {
        toast.success('Google Drive disconnected');
        fetchDriveStatus();
      }
    } catch {
      toast.error('Failed to disconnect');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif text-stone-100 mb-1">Settings</h1>
        <p className="text-stone-500 text-sm">
          Manage your Google Drive connection and app configuration
        </p>
      </div>

      {/* Google Drive Connection Card */}
      <div className="bg-stone-900/40 border border-stone-800/50 rounded-2xl overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-800/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 
            border border-blue-800/30 flex items-center justify-center">
            <HardDrive size={18} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-stone-200 font-medium text-sm">Google Drive</h2>
            <p className="text-stone-600 text-xs">Photo storage backend</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={fetchDriveStatus}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition-all"
              title="Refresh status"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="text-stone-500 animate-spin" />
            </div>
          ) : driveStatus?.status === 'connected' ? (
            /* Connected State */
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={22} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-stone-200 font-medium text-sm">Connected</p>
                  {driveStatus.user && (
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-stone-400 text-sm">{driveStatus.user.displayName}</p>
                      <p className="text-stone-500 text-xs">{driveStatus.user.emailAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                    text-red-400 bg-red-500/10 border border-red-800/30
                    hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  {disconnecting ? <Loader2 size={14} className="animate-spin" /> : <Unplug size={14} />}
                  Disconnect
                </button>
              </div>
            </div>
          ) : driveStatus?.status === 'error' ? (
            /* Error State */
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={22} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-stone-200 font-medium text-sm">Connection Error</p>
                  <p className="text-stone-500 text-xs mt-1 max-w-md">
                    {driveStatus.error}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium
                    bg-gradient-to-r from-blue-600 to-blue-500 text-white
                    hover:from-blue-500 hover:to-blue-400 transition-all
                    shadow-lg shadow-blue-900/30 disabled:opacity-50"
                >
                  {connecting ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                  Reconnect Google Drive
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                    text-stone-400 border border-stone-700/50
                    hover:bg-stone-800 transition-all disabled:opacity-50"
                >
                  Reset Tokens
                </button>
              </div>
            </div>
          ) : (
            /* Disconnected State */
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center flex-shrink-0">
                  <XCircle size={22} className="text-stone-500" />
                </div>
                <div>
                  <p className="text-stone-200 font-medium text-sm">Not Connected</p>
                  <p className="text-stone-500 text-xs mt-1 max-w-md">
                    Connect your Google account to enable photo uploads to Google Drive. 
                    Photos will be stored in your personal Drive.
                  </p>
                </div>
              </div>

              <button
                onClick={handleConnect}
                disabled={connecting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium
                  bg-gradient-to-r from-blue-600 to-blue-500 text-white
                  hover:from-blue-500 hover:to-blue-400 transition-all
                  shadow-lg shadow-blue-900/30 disabled:opacity-50"
              >
                {connecting ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                Connect Google Drive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-stone-900/20 border border-stone-800/30 rounded-2xl p-6">
        <h3 className="text-stone-300 text-sm font-medium mb-3">How Google Drive Integration Works</h3>
        <ul className="space-y-2.5 text-stone-500 text-xs">
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">1</span>
            <span>Click &quot;Connect Google Drive&quot; to authorize this app with your Google account</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">2</span>
            <span>A &quot;Chayabritto Films&quot; folder is automatically created in your Google Drive</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">3</span>
            <span>Uploaded photos are organized into category sub-folders in Google Drive</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">4</span>
            <span>Photos are made publicly readable so they can be displayed on the portfolio</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
