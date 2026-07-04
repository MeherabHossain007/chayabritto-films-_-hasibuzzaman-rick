import { NextResponse } from 'next/server';
import { getDriveClient, isDriveConnected } from '@/lib/google-drive';

/**
 * GET /api/admin/drive-status
 * Check if Google Drive is connected and working.
 */
export async function GET() {
  try {
    const connected = isDriveConnected();

    if (!connected) {
      return NextResponse.json({
        status: 'disconnected',
        message: 'Google Drive is not connected. Go to Settings to connect.',
      });
    }

    // Try a simple API call to verify the token works
    const drive = getDriveClient();
    const res = await drive.about.get({ fields: 'user' });
    const user = res.data.user;

    return NextResponse.json({
      status: 'connected',
      user: {
        displayName: user?.displayName,
        emailAddress: user?.emailAddress,
        photoLink: user?.photoLink,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Drive status check failed:', message);

    return NextResponse.json(
      {
        status: 'error',
        error: message,
      },
      { status: 500 }
    );
  }
}
