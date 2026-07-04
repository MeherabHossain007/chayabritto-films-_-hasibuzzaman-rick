import { NextResponse } from 'next/server';
import { listGalleries, isDriveConnected } from '@/lib/google-drive';

/**
 * GET /api/admin/galleries
 * Returns a list of all client galleries (subfolders inside category folders).
 */
export async function GET() {
  try {
    if (!isDriveConnected()) {
      return NextResponse.json({ galleries: [] });
    }

    const galleries = await listGalleries();
    return NextResponse.json({ galleries });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch galleries';
    console.error('Error fetching galleries:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
