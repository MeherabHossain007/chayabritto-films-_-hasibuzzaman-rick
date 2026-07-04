import { NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/google-drive';

/**
 * GET /api/admin/google/callback
 * OAuth 2.0 callback. Google redirects here with ?code=...
 * Exchanges code for tokens and redirects back to admin settings.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Base URL for redirect
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  if (error) {
    return NextResponse.redirect(
      `${appUrl}/admin/settings?drive_error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${appUrl}/admin/settings?drive_error=${encodeURIComponent('No authorization code received')}`
    );
  }

  try {
    await exchangeCodeForTokens(code);
    
    return NextResponse.redirect(
      `${appUrl}/admin/settings?drive_connected=true`
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Token exchange failed';
    console.error('Google OAuth callback error:', message);
    
    return NextResponse.redirect(
      `${appUrl}/admin/settings?drive_error=${encodeURIComponent(message)}`
    );
  }
}
