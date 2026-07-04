import { NextResponse } from 'next/server';
import { isDriveConnected, getOrCreateCategoryFolder } from '@/lib/google-drive';

const DEFAULT_CATEGORIES = ['Wedding', 'Corporate', 'Cultural', 'Street'];

export async function POST() {
  try {
    const driveConnected = isDriveConnected();
    
    if (!driveConnected) {
      return NextResponse.json(
        { error: 'Google Drive is not connected. Go to Admin > Settings to connect first.' },
        { status: 400 }
      );
    }

    const created = [];

    for (const name of DEFAULT_CATEGORIES) {
      try {
        // This will find or create the category folder in Google Drive
        await getOrCreateCategoryFolder(name);
        created.push(name);
      } catch (driveError) {
        console.error(`Failed to seed Drive folder for ${name}:`, driveError);
      }
    }

    return NextResponse.json({
      success: true,
      message: created.length > 0
        ? `Seeded default categories on Google Drive: ${created.join(', ')}`
        : 'All default categories already exist',
      created,
      driveConnected: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to seed categories';
    console.error('Error seeding categories:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
