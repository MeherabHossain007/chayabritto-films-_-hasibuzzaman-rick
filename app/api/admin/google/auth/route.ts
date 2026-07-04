import { NextResponse } from 'next/server';
import { getAuthUrl, isDriveConnected } from '@/lib/google-drive';

/**
 * GET /api/admin/google/auth
 * Returns the Google OAuth authorization URL to start the consent flow.
 */
export async function GET() {
  try {
    if (isDriveConnected()) {
      return NextResponse.json({
        connected: true,
        message: 'Google Drive is already connected.',
      });
    }

    const url = getAuthUrl();
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
