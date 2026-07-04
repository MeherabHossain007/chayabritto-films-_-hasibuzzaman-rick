import { NextResponse } from 'next/server';
import { getFolderDetails, listPhotosInFolder, isDriveConnected } from '@/lib/google-drive';

/**
 * GET /api/gallery/[id]
 * Public endpoint to fetch photos for a specific customer shared gallery folder.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDriveConnected()) {
      return NextResponse.json(
        { error: 'Google Drive backend is not connected. Contact administrator.' },
        { status: 503 }
      );
    }

    const { id } = await params;

    // Get folder details (name, etc.)
    const folder = await getFolderDetails(id);
    if (!folder) {
      return NextResponse.json(
        { error: 'Gallery not found or access denied.' },
        { status: 404 }
      );
    }

    // List photos in this folder
    const photos = await listPhotosInFolder(id);

    return NextResponse.json({
      name: folder.name,
      id: folder.id,
      createdTime: folder.createdTime,
      photos,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch gallery';
    console.error('Error fetching gallery details:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
