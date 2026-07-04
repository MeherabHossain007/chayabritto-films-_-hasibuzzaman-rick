import { NextResponse } from 'next/server';
import { listCategories, createFolder, isDriveConnected, slugify, findFolder } from '@/lib/google-drive';

export async function GET(request: Request) {
  try {
    if (!isDriveConnected()) {
      return NextResponse.json({ categories: [] });
    }

    const categories = await listCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
    console.error('Error fetching categories:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isDriveConnected()) {
      return NextResponse.json(
        { error: 'Google Drive is not connected. Go to Admin > Settings to connect first.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    // Check if folder already exists in Drive
    const existing = await findFolder(name);
    if (existing) {
      return NextResponse.json(
        { error: 'Category folder already exists in Google Drive' },
        { status: 409 }
      );
    }

    // Create the folder
    const folder = await createFolder(name);

    return NextResponse.json({
      success: true,
      category: { name, slug, driveFolderId: folder.id, driveWebLink: folder.webViewLink },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create category';
    console.error('Error creating category:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
