import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';

let driveClient: drive_v3.Drive | null = null;

// Path to store tokens persistently (in project root, gitignored)
const TOKEN_FILE = path.join(process.cwd(), '.google-tokens.json');

interface StoredTokens {
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
}

/**
 * Read stored tokens from file.
 */
function readStoredTokens(): StoredTokens | null {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = fs.readFileSync(TOKEN_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // File doesn't exist or is corrupt
  }
  return null;
}

/**
 * Write tokens to file for persistence.
 */
export function writeStoredTokens(tokens: StoredTokens): void {
  try {
    const existing = readStoredTokens() || {};
    const merged = { ...existing, ...tokens };
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(merged, null, 2));
  } catch (error) {
    console.warn(
      'Warning: Failed to persist tokens to disk (likely read-only filesystem):',
      error instanceof Error ? error.message : error
    );
  }
  // Reset cached client so it picks up new tokens
  driveClient = null;
}

/**
 * Check if Google Drive is connected (has valid refresh token).
 */
export function isDriveConnected(): boolean {
  // Check env var first
  if (process.env.GOOGLE_REFRESH_TOKEN) return true;
  // Then check file-based tokens
  const tokens = readStoredTokens();
  return !!tokens?.refresh_token;
}

/**
 * Create an OAuth2 client with credentials.
 */
export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local'
    );
  }

  // Use the app's own callback URL for OAuth
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/api/admin/google/callback`;

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generate the Google OAuth authorization URL.
 */
export function getAuthUrl(): string {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive'],
  });
}

/**
 * Exchange authorization code for tokens.
 */
export async function exchangeCodeForTokens(code: string): Promise<StoredTokens> {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  
  // Store tokens persistently
  writeStoredTokens(tokens as StoredTokens);
  
  return tokens as StoredTokens;
}

/**
 * Returns an authenticated Google Drive v3 client using OAuth 2.0 credentials.
 * Uses refresh_token to automatically obtain and refresh access tokens.
 */
export function getDriveClient(): drive_v3.Drive {
  if (!driveClient) {
    const oauth2Client = getOAuth2Client();

    // Get refresh token from env or file
    let refreshToken = process.env.GOOGLE_REFRESH_TOKEN || '';
    const storedTokens = readStoredTokens();
    
    if (storedTokens?.refresh_token) {
      refreshToken = storedTokens.refresh_token;
    }

    if (!refreshToken) {
      throw new Error(
        'Google Drive is not connected. Go to Admin > Settings to connect your Google account.'
      );
    }

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
      access_token: storedTokens?.access_token,
      expiry_date: storedTokens?.expiry_date,
    });

    // Auto-save refreshed tokens
    oauth2Client.on('tokens', (tokens) => {
      writeStoredTokens(tokens as StoredTokens);
    });

    driveClient = google.drive({ version: 'v3', auth: oauth2Client });
  }

  return driveClient;
}

/**
 * Disconnect Google Drive (remove stored tokens).
 */
export function disconnectDrive(): void {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      fs.unlinkSync(TOKEN_FILE);
    }
  } catch {
    // Ignore
  }
  driveClient = null;
}

/**
 * Get the root folder ID for this app in Google Drive.
 */
function getRootFolderId(): string {
  const id = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!id) {
    throw new Error('Missing GOOGLE_DRIVE_ROOT_FOLDER_ID in .env');
  }
  return id;
}

/**
 * Ensure a root folder exists. If GOOGLE_DRIVE_ROOT_FOLDER_ID is not set,
 * create a "Chayabritto Films" folder in the user's Drive root.
 */
export async function ensureRootFolder(): Promise<string> {
  const envId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (envId) return envId;

  const drive = getDriveClient();
  const folderName = 'Chayabritto Films';

  // Check if it already exists
  const res = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false and 'root' in parents`,
    fields: 'files(id)',
    pageSize: 1,
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id!;
  }

  // Create it
  const createRes = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  });

  return createRes.data.id!;
}

/**
 * Create a folder in Google Drive.
 */
export async function createFolder(
  name: string,
  parentFolderId?: string
): Promise<{ id: string; webViewLink: string }> {
  const drive = getDriveClient();
  const parent = parentFolderId || await ensureRootFolder();

  const response = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parent],
    },
    fields: 'id, webViewLink',
  });

  return {
    id: response.data.id!,
    webViewLink: response.data.webViewLink || '',
  };
}

/**
 * Find a folder by name under a parent folder.
 */
export async function findFolder(
  name: string,
  parentFolderId?: string
): Promise<{ id: string; webViewLink: string } | null> {
  const drive = getDriveClient();
  const parent = parentFolderId || await ensureRootFolder();

  const response = await drive.files.list({
    q: `name='${name}' and '${parent}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, webViewLink)',
    pageSize: 1,
  });

  const files = response.data.files;
  if (files && files.length > 0) {
    return {
      id: files[0].id!,
      webViewLink: files[0].webViewLink || '',
    };
  }

  return null;
}

/**
 * Get or create a category folder under the root folder.
 */
export async function getOrCreateCategoryFolder(
  categoryName: string
): Promise<{ id: string; webViewLink: string }> {
  const existing = await findFolder(categoryName);
  if (existing) return existing;
  return createFolder(categoryName);
}

/**
 * Upload a file to Google Drive.
 */
export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folderId: string
): Promise<{
  fileId: string;
  webViewLink: string;
  webContentLink: string;
  thumbnailLink: string;
}> {
  const drive = getDriveClient();

  // Create readable stream from buffer
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: 'id, webViewLink, webContentLink, thumbnailLink',
  });

  // Make the file publicly readable
  await drive.permissions.create({
    fileId: response.data.id!,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  const fileId = response.data.id!;

  return {
    fileId,
    webViewLink: response.data.webViewLink || '',
    webContentLink: response.data.webContentLink || `https://drive.google.com/uc?id=${fileId}&export=view`,
    thumbnailLink: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
  };
}

/**
 * Delete a file from Google Drive.
 */
export async function deleteFile(fileId: string): Promise<void> {
  const drive = getDriveClient();
  await drive.files.delete({ fileId });
}

/**
 * List files in a folder.
 */
export async function listFilesInFolder(
  folderId: string
): Promise<drive_v3.Schema$File[]> {
  const drive = getDriveClient();

  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType, webViewLink, thumbnailLink, size, createdTime)',
    orderBy: 'createdTime desc',
    pageSize: 100,
  });

  return response.data.files || [];
}

/**
 * Helper to slugify a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * List all categories (folders under root folder) from Google Drive.
 */
export async function listCategories(): Promise<
  {
    name: string;
    slug: string;
    driveFolderId: string;
    driveWebLink: string;
    createdAt: string;
    photoCount: number;
  }[]
> {
  const drive = getDriveClient();
  const rootId = await ensureRootFolder();

  const response = await drive.files.list({
    q: `'${rootId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name, webViewLink, createdTime)',
    orderBy: 'name',
    pageSize: 100,
  });

  const folders = response.data.files || [];
  
  // Get photoCount for each folder in parallel
  const categoryPromises = folders.map(async (folder) => {
    const files = await listFilesInFolder(folder.id!);
    // Only count image files
    const imageFiles = files.filter(f => f.mimeType?.startsWith('image/'));
    
    return {
      name: folder.name!,
      slug: slugify(folder.name!),
      driveFolderId: folder.id!,
      driveWebLink: folder.webViewLink || '',
      createdAt: folder.createdTime || new Date().toISOString(),
      photoCount: imageFiles.length,
    };
  });

  return Promise.all(categoryPromises);
}

/**
 * List all photos from Google Drive.
 * If categorySlug is specified, lists photos from that category.
 * Otherwise, lists photos from all categories.
 */
export async function listAllPhotos(categorySlug?: string): Promise<
  {
    id: string;
    title: string;
    driveFileId: string;
    webViewLink: string;
    webContentLink: string;
    thumbnailLink: string;
    categoryName: string;
    categorySlug: string;
    uploadedAt: string;
  }[]
> {
  const categories = await listCategories();
  
  // Filter categories if a specific slug is requested
  const targetCategories = categorySlug && categorySlug !== 'All'
    ? categories.filter(c => c.slug === categorySlug)
    : categories;

  const photoPromises = targetCategories.map(async (cat) => {
    const files = await listFilesInFolder(cat.driveFolderId);
    // Filter to only include image files
    const imageFiles = files.filter(f => f.mimeType?.startsWith('image/'));
    
    return imageFiles.map((file) => ({
      id: file.id!,
      title: file.name!,
      driveFileId: file.id!,
      webViewLink: file.webViewLink || '',
      webContentLink: `https://drive.google.com/uc?id=${file.id}&export=view`,
      thumbnailLink: `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`,
      categoryName: cat.name,
      categorySlug: cat.slug,
      uploadedAt: file.createdTime || new Date().toISOString(),
    }));
  });

  const results = await Promise.all(photoPromises);
  const flattened = results.flat();
  
  // Sort by uploaded time descending
  return flattened.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

/**
 * List all customer galleries (subfolders inside category folders, plus category folders themselves).
 */
export async function listGalleries(): Promise<
  {
    id: string;
    name: string;
    categoryName: string;
    categorySlug: string;
    photoCount: number;
    webViewLink: string;
    createdAt: string;
    isCategory?: boolean;
  }[]
> {
  const drive = getDriveClient();
  const categories = await listCategories();
  
  const galleryPromises = categories.map(async (cat) => {
    // List folders inside this category folder
    const response = await drive.files.list({
      q: `'${cat.driveFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name, webViewLink, createdTime)',
      orderBy: 'name',
      pageSize: 100,
    });

    const subfolders = response.data.files || [];
    
    // For each subfolder, count files and map details
    const subfolderDetails = await Promise.all(subfolders.map(async (sub) => {
      const files = await listFilesInFolder(sub.id!);
      const imageFiles = files.filter(f => f.mimeType?.startsWith('image/'));
      
      return {
        id: sub.id!,
        name: sub.name!,
        categoryName: cat.name,
        categorySlug: cat.slug,
        photoCount: imageFiles.length,
        webViewLink: sub.webViewLink || '',
        createdAt: sub.createdTime || new Date().toISOString(),
        isCategory: false,
      };
    }));

    // Add the category folder itself as a gallery
    const categoryGallery = {
      id: cat.driveFolderId,
      name: `${cat.name} (Entire Category)`,
      categoryName: cat.name,
      categorySlug: cat.slug,
      photoCount: cat.photoCount,
      webViewLink: cat.driveWebLink || '',
      createdAt: cat.createdAt || new Date().toISOString(),
      isCategory: true,
    };

    return [categoryGallery, ...subfolderDetails];
  });

  const results = await Promise.all(galleryPromises);
  const flattened = results.flat();

  // Sort by isCategory first (putting entire categories at the top), then by date descending
  return flattened.sort((a, b) => {
    if (a.isCategory && !b.isCategory) return -1;
    if (!a.isCategory && b.isCategory) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Get folder metadata by ID.
 */
export async function getFolderDetails(folderId: string): Promise<{
  id: string;
  name: string;
  webViewLink: string;
  createdTime: string;
} | null> {
  try {
    const drive = getDriveClient();
    const res = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, webViewLink, createdTime, mimeType, trashed',
    });

    if (res.data.trashed || res.data.mimeType !== 'application/vnd.google-apps.folder') {
      return null;
    }

    return {
      id: res.data.id!,
      name: res.data.name!,
      webViewLink: res.data.webViewLink || '',
      createdTime: res.data.createdTime || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching folder details:', error);
    return null;
  }
}

/**
 * List all photos directly inside a specific folder ID.
 */
export async function listPhotosInFolder(folderId: string): Promise<
  {
    id: string;
    title: string;
    driveFileId: string;
    webViewLink: string;
    webContentLink: string;
    thumbnailLink: string;
    uploadedAt: string;
    size?: string;
  }[]
> {
  const files = await listFilesInFolder(folderId);
  const imageFiles = files.filter(f => f.mimeType?.startsWith('image/'));

  return imageFiles.map((file) => ({
    id: file.id!,
    title: file.name!,
    driveFileId: file.id!,
    webViewLink: file.webViewLink || '',
    webContentLink: `https://drive.google.com/uc?id=${file.id}&export=view`,
    thumbnailLink: `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`,
    uploadedAt: file.createdTime || new Date().toISOString(),
    size: file.size ? `${(parseInt(file.size) / (1024 * 1024)).toFixed(2)} MB` : undefined,
  }));
}


